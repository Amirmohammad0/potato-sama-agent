# Kali Web Terminal

Browser-based Linux terminal UI backed by Vercel Sandbox.

## Status

MVP deployed on Vercel. The production architecture uses a Vercel Function as the control plane and Vercel Sandbox as the isolated execution plane.

The next step is replacing the default sandbox runtime with a custom Kali OCI image stored in Vercel Container Registry and adding a persistent interactive PTY/session layer.
