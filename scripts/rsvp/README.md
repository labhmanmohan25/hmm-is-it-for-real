# RSVP integration

The existing website form submits to `POST /api/rsvp`. The server validates the payload and forwards it to a Google Apps Script web app. The script saves a native Google Form response and returns its receipt. The Form is linked to a private Google Sheet. Repeated requests with the same submission ID return the original receipt.

## Google setup

The prepared Apps Script project is:
https://script.google.com/home/projects/121CYAiWkeyGpfysTunrM5oknbI37mcjYKLyOhvyQvJzgKcwTr0TT3TvW/edit

Its title is **Wedding RSVP — Apurva & Manmohan**. The integration code has been saved in Code.gs. Setup completed and created the Form and Sheet. Web app deployment is waiting for Google’s **Authorize access** step; no deployed endpoint or live submission has been verified.

Responses Sheet: https://docs.google.com/spreadsheets/d/1J43xejdC0t1WHdnxscdv6kHHRRGONvZY-7l66S_TXjg/edit

Form: https://docs.google.com/forms/d/1ZhKrQu60DvxSUdJVmRf3_Q93j-In9zTLnjBbNHxh_ao/edit

The server secret has been stored in ignored `.env.local`. The deployment URL still needs setting locally and both variables need adding to production.

1. Run `setup` once and authorize the script. It creates a Form and linked Sheet in your account. Subsequent setup runs do nothing after successful initialization.
2. The execution log contains the response Sheet link, Form edit link, and server secret. Keep the secret private.
3. Deploy → New deployment → Web app. Execute as yourself and allow Anyone to call the endpoint. The script checks a shared secret before opening the Form or accepting a response. Do not share the Form/Sheet publicly.
4. Set `RSVP_SCRIPT_URL` to the deployment's `/exec` URL and `RSVP_SCRIPT_SECRET` to the generated secret in `.env.local` and the production hosting environment. Never prefix these with `NEXT_PUBLIC_`.
5. Restart/redeploy the Next.js website.
6. Submit a clearly labeled test RSVP through the website; verify the response in both the Form and linked Sheet. Retry the same request ID to verify that it produces no second response. Check that validation errors and upstream failures never show success.

The script source is in `Code.gs`. If updating a deployment, create a new deployment version so it runs the updated script.

No live Google submission has been verified yet. Until the environment is configured, the API returns a clear unavailable response rather than pretending an RSVP was saved.
