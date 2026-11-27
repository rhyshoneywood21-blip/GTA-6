# Launcher correction candidate (not installed)

The source bitmap extracted from V2.2.0 matches approved Git blob `03254f280970fccff00bfc4bf83774d9db920655`. It is 108x108 and was cropped from the approved branding mockup; its right/bottom outer neon frame is already cut in the bitmap. Existing 24% adaptive inset and 12% legacy inset checks only verify strings, not visual fit.

Candidate first extends the source from 108x108 to 114x114 by mirroring the intact left/top outer strips to reconstruct the missing right/bottom frame. All original pixels remain unchanged; reconstructed edge is an approximation, not recovered original pixels. The corrected frame is then centered in uniquely named legacy and adaptive icon resources. Adaptive canvas 108dp, logo 50dp, 29dp padding each side; 432px PNG, 200px inner art. Legacy canvas includes symmetrical 72px margins. Rounded-square and circle mask simulations show zero nontransparent logo pixels clipped. Physical-device verification remains required.

Integration: point both `android:icon` and `android:roundIcon` to `@drawable/ultimate_launcher_v230` in AndroidManifest.xml; leave package ID and storage alone. Update `scripts/check-data.mjs` to verify new PNG dimensions/alpha bounds, manifest references and XML resource targets, preserving approved original artwork hash check. Build only after browser/Pages QA. Inspect actual launcher and splash on the user's Android phone; verify cache refresh and update compatibility before declaring fixed.

Reference: https://developer.android.com/develop/ui/compose/system/icon_design_adaptive?hl=en
