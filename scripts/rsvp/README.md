# RSVP integration

The existing website form submits to `POST /api/rsvp`. The server validates the payload and forwards it to a Google Apps Script web app. The script saves a native Google Form response and returns its receipt. The Form is linked to a private Google Sheet. Repeated requests with the same submission ID return the original receipt.

## Google setup

The prepared Apps Script project is:
https://script.google.com/home/projects/121CYAiWkeyGpfysTunrM5oknbI37mcjYKLyOhvyQvJzgKcwTr0TT3TvW/edit

Its title is **Wedding RSVP — Apurva & Manmohan**. Setup and deployment are complete.

Deployment URL: https://script.google.com/macros/s/AKfycbyaCONCmfKXhyAyxEytU4iCDWBE43ZxSSl7063I_NVcINusp-rO5sCffpTZskk2S5Dj/exec

Both server environment variables are configured in ignored `.env.local` and as protected production variables on Vercel. Never commit the secret.

Responses Sheet: https://docs.google.com/spreadsheets/d/1J43xejdC0t1WHdnxscdv6kHHRRGONvZY-7l66S_TXjg/edit

Form: https://docs.google.com/forms/d/1ZhKrQu60DvxSUdJVmRf3_Q93j-In9zTLnjBbNHxh_ao/edit



1. Run `setup` once and authorize the script. It creates a Form and linked Sheet in your account. Subsequent setup runs do nothing after successful initialization.
2. The execution log contains the response Sheet link, Form edit link, and server secret. Keep the secret private.
3. Deploy → New deployment → Web app. Execute as yourself and allow Anyone to call the endpoint. The script checks a shared secret before opening the Form or accepting a response. Do not share the Form/Sheet publicly.
4. Set `RSVP_SCRIPT_URL` to the deployment's `/exec` URL and `RSVP_SCRIPT_SECRET` to the generated secret in `.env.local` and the production hosting environment. Never prefix these with `NEXT_PUBLIC_`.
5. Restart/redeploy the Next.js website.
6. Submit a clearly labeled test RSVP through the website; verify the response in both the Form and linked Sheet. Retry the same request ID to verify that it produces no second response. Check that validation errors and upstream failures never show success.

The script source is in `Code.gs`. If updating a deployment, create a new deployment version so it runs the updated script.

Live Google tests accepted both stay choices and returned the same receipt for retries. Test responses are clearly labeled INTEGRATION TEST and must be excluded from guest totals. The connected Google Drive account cannot read the private response Sheet (403), so direct row inspection was unavailable.

## Stay preference update (26 November 2026)

The website now requires `stay` to be `own` or `friends-bungalow`. The bungalow covers the nights of 17 and 18 January 2027, with check-in on 17 January and checkout on 19 January.

For future Google script updates:

1. Replace the Google project's Code.gs with this directory's updated `Code.gs`.
2. Run `setup` again. It now adds a `Stay` question to the existing Form without recreating it or replacing any responses. Responses are mapped by question title so the appended question cannot shift other answers.
3. Deploy the updated script as a web app (or update the existing deployment to a new version), executing as you, callable by Anyone. Complete Google's authorization. The shared secret protects submissions; the response Sheet stays private.
4. Copy its `/exec` URL to `RSVP_SCRIPT_URL` in `.env.local` and production. Set the existing `RSVP_SCRIPT_SECRET` in production as well.
5. Restart/redeploy the website. Verify one test for each stay choice in the linked Sheet, plus a retry with the same submission ID to check duplicate protection.

Local validation: `node scripts/rsvp/test.mjs` covers both stay values, missing/invalid stay, field validation, saving, configuration failure and upstream failure. It mocks Google and does not prove the live deployment works.
