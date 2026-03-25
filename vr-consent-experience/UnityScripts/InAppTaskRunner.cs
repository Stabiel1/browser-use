using System;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.Events;

namespace VrConsentExperience.Runtime
{
    [Serializable]
    public struct InAppTask
    {
        [TextArea(2, 6)]
        public string prompt;
        public bool completed;
    }

    /// <summary>
    /// Presents tasks only inside the VR app. Wire UI buttons to SubmitCurrentTask / SkipCurrentTask as your ethics allow.
    /// </summary>
    public sealed class InAppTaskRunner : MonoBehaviour
    {
        [SerializeField] private ConsentSessionController session;
        [SerializeField] private List<InAppTask> tasks = new List<InAppTask>();

        [SerializeField] private UnityEvent<string> onTaskPromptChanged;
        [SerializeField] private UnityEvent onAllTasksComplete;

        public int CurrentIndex { get; private set; }

        private void OnEnable()
        {
            if (session != null)
            {
                session.SessionStarted += OnSessionStarted;
                session.SafewordInvoked += OnStopped;
                session.SessionStopped += OnStopped;
            }
        }

        private void OnDisable()
        {
            if (session != null)
            {
                session.SessionStarted -= OnSessionStarted;
                session.SafewordInvoked -= OnStopped;
                session.SessionStopped -= OnStopped;
            }
        }

        private void OnSessionStarted()
        {
            CurrentIndex = 0;
            BroadcastPrompt();
        }

        private void OnStopped()
        {
            CurrentIndex = 0;
        }

        private void BroadcastPrompt()
        {
            if (tasks == null || tasks.Count == 0)
            {
                onTaskPromptChanged?.Invoke(string.Empty);
                return;
            }

            if (CurrentIndex >= tasks.Count)
            {
                onAllTasksComplete?.Invoke();
                onTaskPromptChanged?.Invoke(string.Empty);
                return;
            }

            onTaskPromptChanged?.Invoke(tasks[CurrentIndex].prompt);
        }

        /// <summary>Mark current task done and advance.</summary>
        public void SubmitCurrentTask()
        {
            if (session == null || !session.SessionActive || tasks == null || tasks.Count == 0)
            {
                return;
            }

            if (CurrentIndex >= tasks.Count)
            {
                return;
            }

            var t = tasks[CurrentIndex];
            t.completed = true;
            tasks[CurrentIndex] = t;
            CurrentIndex++;
            BroadcastPrompt();
        }

        public void SkipCurrentTask()
        {
            if (session == null || !session.SessionActive)
            {
                return;
            }

            CurrentIndex++;
            BroadcastPrompt();
        }
    }
}
