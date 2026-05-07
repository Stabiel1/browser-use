using System;
using UnityEngine;
using UnityEngine.Events;

namespace VrConsentExperience.Runtime
{
    /// <summary>
    /// Gates scene flow: explicit start, instant stop via safeword, session end.
    /// Attach to a persistent GameObject on the XR rig or a managers object.
    /// </summary>
    public sealed class ConsentSessionController : MonoBehaviour
    {
        [SerializeField] private bool requireStartConfirmation = true;
        [SerializeField] private UnityEvent onSessionStarted;
        [SerializeField] private UnityEvent onSessionStopped;
        [SerializeField] private UnityEvent onSafewordInvoked;

        public bool SessionActive { get; private set; }

        public event Action SessionStarted;
        public event Action SessionStopped;
        public event Action SafewordInvoked;

        private void Awake()
        {
            SessionActive = !requireStartConfirmation;
            if (SessionActive)
            {
                RaiseStarted();
            }
        }

        /// <summary>Call from UI after user acknowledges boundaries.</summary>
        public void ConfirmStartSession()
        {
            if (SessionActive)
            {
                return;
            }

            SessionActive = true;
            RaiseStarted();
        }

        /// <summary>Call from voice router, dedicated button, or triple-press handler.</summary>
        public void InvokeSafeword()
        {
            if (!SessionActive)
            {
                return;
            }

            SessionActive = false;
            onSafewordInvoked?.Invoke();
            SafewordInvoked?.Invoke();
            onSessionStopped?.Invoke();
            SessionStopped?.Invoke();
        }

        /// <summary>Normal end of session (user chooses to leave).</summary>
        public void EndSession()
        {
            if (!SessionActive)
            {
                return;
            }

            SessionActive = false;
            onSessionStopped?.Invoke();
            SessionStopped?.Invoke();
        }

        private void RaiseStarted()
        {
            onSessionStarted?.Invoke();
            SessionStarted?.Invoke();
        }
    }
}
