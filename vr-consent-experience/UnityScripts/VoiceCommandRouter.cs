using UnityEngine;
using UnityEngine.Events;

namespace VrConsentExperience.Runtime
{
    /// <summary>
    /// Wire your platform speech-to-text to OnPhraseRecognized, or call SimulatePhrase for editor tests.
    /// Only reacts while session is active. Map phrases to in-game actions only.
    /// </summary>
    public sealed class VoiceCommandRouter : MonoBehaviour
    {
        [SerializeField] private ConsentSessionController session;
        [SerializeField] private string safewordPhrase = "red";
        [SerializeField] private string hapticCuePhrase = "pause";
        [SerializeField] private XRHapticPulse haptics;
        [SerializeField] private UnityEvent<string> onRecognizedPhrase;

        public void OnPhraseRecognized(string phrase)
        {
            if (session == null || !session.SessionActive || string.IsNullOrWhiteSpace(phrase))
            {
                return;
            }

            var normalized = phrase.Trim().ToLowerInvariant();
            onRecognizedPhrase?.Invoke(normalized);

            if (normalized.Contains(safewordPhrase.ToLowerInvariant()))
            {
                session.InvokeSafeword();
                return;
            }

            if (haptics != null && normalized.Contains(hapticCuePhrase.ToLowerInvariant()))
            {
                haptics.PulseBothHands();
            }
        }

        public void SimulatePhrase(string phrase)
        {
            OnPhraseRecognized(phrase);
        }
    }
}
