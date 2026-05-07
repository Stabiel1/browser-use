using UnityEngine;
using UnityEngine.XR;

namespace VrConsentExperience.Runtime
{
    /// <summary>
    /// Short, bounded haptic pulse on left/right controller. Only call while session is active.
    /// </summary>
    public sealed class XRHapticPulse : MonoBehaviour
    {
        [SerializeField] private ConsentSessionController session;
        [Range(0f, 1f)] [SerializeField] private float amplitude = 0.4f;
        [SerializeField] private float durationSeconds = 0.08f;

        public void PulseBothHands()
        {
            if (session == null || !session.SessionActive)
            {
                return;
            }

            TryPulse(XRNode.LeftHand);
            TryPulse(XRNode.RightHand);
        }

        public void PulseRightHand()
        {
            if (session == null || !session.SessionActive)
            {
                return;
            }

            TryPulse(XRNode.RightHand);
        }

        private void TryPulse(XRNode node)
        {
            var device = InputDevices.GetDeviceAtXRNode(node);
            if (!device.isValid)
            {
                return;
            }

            if (device.TryGetHapticCapabilities(out var caps) && caps.supportsImpulse)
            {
                device.SendHapticImpulse(0u, amplitude, durationSeconds);
            }
        }
    }
}
