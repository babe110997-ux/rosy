## HAR Analysis Summary - loging 33.har

### Overview
The HAR contains 30 requests in total:
- 200: 20
- 204: 9
- 304: 1

No 4xx or 5xx errors were found.

### Main Findings
1. The main business domain is `prod4.luckyking.com.ph`.
2. Core homepage/public APIs are responding normally.
3. Public modules such as popups and game lists are loaded successfully.
4. Some sub-requests inside `/api/v2/user/bulk` return:
   - `code: 2005`
   - `message: "Unauthenticated"`
   This indicates the session is likely in guest/unauthenticated state.
5. Popup API returns an active popup:
   - `15% Daily First Topup (1)`
   - `active: true`
   - `skip_today: 1`
6. Flash popup query returns empty data.
7. Game APIs return valid game data for:
   - popular/new/jili
   - gem-tournament
   - JILI

### Testing Implication for Cypress
This HAR is suitable for:
- homepage smoke test
- guest state validation
- popup API smoke test
- public game section validation

This HAR is not sufficient for:
- successful login flow testing
- post-login popup validation
- recharge/withdrawal flow testing

### Recommended Cypress Focus
- intercept `/api/v2/user/bulk`
- intercept `/api/v2/user/popups`
- intercept `/api/v2/user/entertainment/games`
- validate homepage loads successfully
- validate popup API returns active data
- validate public game sections return non-empty data
- validate unauthenticated sub-responses are expected in guest mode
