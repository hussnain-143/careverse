## Careverse

Careverse is a Next.js (App Router) web app that provides:

- An AI-powered chat experience (conversations + messages).
- “Assessment” generation from a chat conversation and a results UI.
- Provider + product recommendations (rendered from assessment payload).
- Lightweight auth token handling (access + refresh tokens) on the client.

This README documents **all public modules/components/functions exported by the app**, plus the **backend endpoints the UI calls**, with usage examples and implementation notes that match the current code.

## Table of contents

- [Quickstart](#quickstart)
- [Environment variables](#environment-variables)
- [App routes](#app-routes)
- [Client-side storage contract](#client-side-storage-contract)
- [Public utilities (APIs)](#public-utilities-apis)
- [Redux store public API](#redux-store-public-api)
- [Public components](#public-components)
- [Backend endpoints used by the UI](#backend-endpoints-used-by-the-ui)

## Quickstart

```bash
npm install
npm run dev
```

Then open `http://localhost:3000`.

## Environment variables

These are referenced directly by the current code and should be set for full functionality.

- **`NEXT_PUBLIC_API_BASE_URL`**: Base URL for the backend API used by `apiClient` and auth actions.
  - Example: `https://api.example.com`
- **`NEXT_PUBLIC_GEOCODE_KEY`**: OpenCage API key used by `LocationModal` reverse geocoding.
- **`NEXT_PUBLIC_GOOGLE_MAP_API_KEY`**: Google Maps Static API key used to render the map image on assessment pages.

Minimal `.env.local` example:

```bash
NEXT_PUBLIC_API_BASE_URL="https://api.example.com"
NEXT_PUBLIC_GEOCODE_KEY="YOUR_OPENCAGE_KEY"
NEXT_PUBLIC_GOOGLE_MAP_API_KEY="YOUR_GOOGLE_MAPS_KEY"
```

## App routes

Routes are defined under `app/` (Next.js App Router).

| Route | File | What it does |
| --- | --- | --- |
| `/` | `app/page.jsx` | Landing page (header + main + footer + location modal). Starts a chat conversation. |
| `/home` | `app/home/page.jsx` | Redirects to `/`. |
| `/login` | `app/login/page.jsx` | Lazy-loads the login UI. |
| `/register` | `app/register/page.jsx` | Lazy-loads the registration UI. |
| `/chat` | `app/chat/page.jsx` | Chat UI; loads conversations, sends messages, can generate an assessment. |
| `/assessment-results` | `app/assessment-results/page.jsx` | Shows results for the most recently generated assessment (from Redux). |
| `/assessment/[id]` | `app/assessment/[id]/page.jsx` | Loads and shows a specific saved assessment by ID. |
| `/user` | `app/user/page.jsx` | Profile page (reads `user` from storage). |
| `*` | `app/not-found.jsx` | Custom 404 page. |

Global layout:

- `app/layout.jsx`: Defines `metadata` and wraps pages with the Redux `Providers` component.
- `app/providers.tsx`: Redux Provider wrapper.

## Client-side storage contract

The app relies on browser storage for auth + session context.

### Token storage keys

Managed by `TokenManager` (`app/src/utils/tokenUtils.js`):

- **`authToken`**: access token (stored in `localStorage` if “remember me”, otherwise `sessionStorage`)
- **`refreshToken`**: refresh token (stored in the same location as `authToken`)
- **`rememberMe`**: `"true"`/`"false"` (stored in `localStorage`)

### Other keys used by the UI

- **`user`** (`localStorage` or `sessionStorage`): user object persisted after login.
  - Written by: `app/components/login/main.jsx`
  - Read by: `app/user/page.jsx`
- **`conversationId`** (`sessionStorage`): current chat conversation ID.
  - Written by: `app/components/home/main.jsx` (when starting a conversation)
  - Read by: `app/components/chat/Chatpage.jsx`
- **`userLocation`** (`localStorage`): JSON payload with lat/lon + location fields.
  - Written by: `app/components/home/LocationModal.jsx`
  - Read by: `app/components/home/main.jsx` to gate “Get Started”

## Public utilities (APIs)

### `TokenManager` (`app/src/utils/tokenUtils.js`)

Export: `export const TokenManager = { ... }`

#### `TokenManager.setTokens(token, refreshToken, rememberMe?)`

- **Purpose**: Persist auth tokens for later API usage.
- **Parameters**:
  - `token` (string)
  - `refreshToken` (string)
  - `rememberMe` (boolean, default `false`)
- **Behavior**:
  - If `rememberMe` is `true`, stores tokens in `localStorage` and sets `rememberMe` to `"true"`.
  - Otherwise, stores tokens in `sessionStorage` and sets `rememberMe` to `"false"` in `localStorage`.

Example:

```js
import { TokenManager } from "@/app/src/utils/tokenUtils";

TokenManager.setTokens(accessToken, refreshToken, true);
```

#### `TokenManager.getTokens()`

- **Returns**: `{ token, refreshToken, rememberMe }`
- **Behavior**:
  - Reads `rememberMe` from `localStorage` to determine whether to pull tokens from `localStorage` or `sessionStorage`.

Example:

```js
const { token, refreshToken, rememberMe } = TokenManager.getTokens();
```

#### `TokenManager.clearTokens()`

- **Purpose**: Log out locally (clears auth + remembered user data).
- **Clears**:
  - `authToken`, `refreshToken` (both local + session storage)
  - `rememberMe`
  - `userEmail` (also removed)

Example:

```js
TokenManager.clearTokens();
window.location.href = "/login";
```

#### `TokenManager.hasTokens()`

- **Returns**: boolean indicating whether both access + refresh tokens are present.

---

### `apiClient` (`app/src/utils/apiClient.js`)

Export: `export const apiClient = new ApiClient();`

`apiClient` is a small fetch wrapper that:

- Prefixes requests with **`process.env.NEXT_PUBLIC_API_BASE_URL`**
- Adds an `Authorization: Bearer <token>` header (when available via `TokenManager.getTokens()`)
- On **HTTP 401**, attempts a refresh flow:
  - Calls `POST /api/v1/auth/refresh-token` with `{ refreshToken }`
  - Updates tokens via `TokenManager.setTokens(...)`
  - Retries the original request
  - Queues concurrent 401 requests while refresh is in progress
  - On refresh failure: clears tokens and redirects to `/login` in the browser

#### `apiClient.request(url, options?)`

- **Parameters**:
  - `url` (string): path beginning with `/...` (joined to base URL)
  - `options` (RequestInit-like): method/headers/body/etc.
- **Returns**: `await response.json()`
- **Throws**: `Error` on non-OK responses (after any refresh retry logic).

#### Convenience methods

- `apiClient.get(url, options?)`
- `apiClient.post(url, data, options?)` (JSON body)
- `apiClient.patch(url, data, options?)` (JSON body)
- `apiClient.put(url, data, options?)` (JSON body)
- `apiClient.delete(url, options?)`

Example:

```js
import { apiClient } from "@/app/src/utils/apiClient";

const conversations = await apiClient.get("/api/v1/chat/conversations?page=1&limit=12");
const created = await apiClient.post("/api/v1/chat/conversations/start", { message: "Hi" });
```

## Redux store public API

Redux is configured in:

- `app/src/store/store.ts`
- `app/src/store/dataSlice.ts`

### `store` (`app/src/store/store.ts`)

Export: `export const store = configureStore({ reducer: { data: dataReducer } })`

Also exports:

- `RootState` type
- `AppDispatch` type

### `dataSlice` (`app/src/store/dataSlice.ts`)

State shape (current):

- `state.data.apiData`: holds the assessment generation response payload used by `/assessment-results`.

Public action:

- `setApiData(payload)`: sets `state.data.apiData = payload`

Usage example (as implemented in chat):

```js
import { useDispatch } from "react-redux";
import { setApiData } from "@/app/src/store/dataSlice";

dispatch(setApiData(resp));
```

Usage example (as implemented in assessment results):

```js
import { useSelector } from "react-redux";

const apiData = useSelector((state) => state.data.apiData);
```

## Public components

This section documents components that are imported/used by other modules (or exposed via routes).

### `Providers` (`app/providers.tsx`)

Export: `export function Providers({ children })`

- **Props**
  - `children` (`React.ReactNode`): app subtree
- **Behavior**
  - Wraps children in `react-redux` `<Provider store={store}>`.

Usage (as implemented in `app/layout.jsx`):

```jsx
<Providers>{children}</Providers>
```

---

### `Loading` (`app/loading.jsx`)

Export: default component `Loading({ message })`

- **Props**
  - `message` (string | falsy): if provided, renders text under the spinner.

Usage:

```jsx
<Loading message="Loading chat..." />
```

---

### `Toast` (`app/components/common/Toast.jsx`)

Export: default component `Toast({ message, type, onClose })`

- **Props**
  - `message` (string): text to display
  - `type` (`"success"` | other): `"success"` shows a green success style; anything else shows error styling
  - `onClose` (function): called on close button click and auto-dismiss
- **Behavior**
  - Auto-dismisses after 4000ms via `useEffect()`.

Usage:

```jsx
{toast && (
  <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
)}
```

---

### Home components

#### `HomeHeader` (`app/components/home/header.jsx`)

Export: default component `HomeHeader`

- **Behavior**
  - Reads token once on mount via `TokenManager.getTokens()` to decide whether to show “Login” or “Logout”.
  - “Logout” clears tokens via `TokenManager.clearTokens()` and hard-navigates to `/login`.
  - Provides desktop + mobile nav (anchors `#how-it-works` and `#about`).

#### `HomeMain` (`app/components/home/main.jsx`)

Export: default component `HomeMain`

- **Public behavior / contract**
  - Requires a stored location (`localStorage.userLocation`) before starting a chat.
  - Requires an auth token (looks for `localStorage.authToken` OR `sessionStorage.authToken`) before starting a chat; redirects to `/login` if absent.
  - Starts a conversation by calling `apiClient.post("/api/v1/chat/conversations/start", { message })`.
  - Stores `conversationId` in `sessionStorage` and navigates to `/chat`.

#### `HomeFooter` (`app/components/home/footer.jsx`)

Export: default component `HomeFooter`

- Static footer links and copyright.

#### `LocationModal` (`app/components/home/LocationModal.jsx`)

Export: default component `LocationModal`

- **Behavior**
  - Shows automatically when `localStorage.userLocation` is not set.
  - On “Allow Location Access”:
    - Uses `navigator.geolocation.getCurrentPosition`
    - Reverse-geocodes lat/lon via OpenCage:
      - `GET https://api.opencagedata.com/geocode/v1/json?q=<lat>+<lon>&key=<NEXT_PUBLIC_GEOCODE_KEY>`
    - Stores a JSON payload to `localStorage.userLocation`
    - If a token is present, updates backend location via:
      - `apiClient.patch("/api/v1/users/location", finalData)`

---

### Auth components

#### `LoginPage` (`app/components/login/main.jsx`)

Export: default component `LoginPage`

- Implements a client-side form action `loginAction(prevState, formData)` using `useActionState`.
- **Calls**: `POST ${NEXT_PUBLIC_API_BASE_URL}/api/v1/auth/login`
- **Expects**: `data.data` to include `{ token, refreshToken, user }`
- **Side effects**:
  - If `user` exists, stores it in `localStorage.user`
  - Stores tokens via `TokenManager.setTokens(token, refreshToken, rememberMe)`
  - On success: shows a success toast and navigates to `/`

#### `RegisterPage` (`app/components/register/main.jsx`)

Export: default component `RegisterPage`

- Implements a client-side form action `registerAction(prevState, formData)` using `useActionState`.
- **Calls**: `POST ${NEXT_PUBLIC_API_BASE_URL}/api/v1/auth/register`
- **On success**: shows toast and navigates to `/login`.

Route wrappers (lazy loading):

- `app/login/page.jsx`: lazy-loads `app/components/login/main.jsx`
- `app/register/page.jsx`: lazy-loads `app/components/register/main.jsx`

---

### Chat components

#### `ChatPage` (`app/components/chat/Chatpage.jsx`)

Export: default component `ChatPage`

Key behaviors:

- Loads recent conversations via:
  - `apiClient.get("/api/v1/chat/conversations?page=1&limit=12")`
- If `sessionStorage.conversationId` exists, loads that conversation via:
  - `apiClient.get("/api/v1/chat/conversations/<id>?page=1&limit=10")`
- Sends a message via:
  - `apiClient.post("/api/v1/chat/conversations/<id>/messages", { message })`
- Generates an assessment from the active conversation via:
  - `apiClient.post("/api/v1/assessments/generate", { conversationId })`
  - Dispatches `setApiData(resp)` (Redux) and navigates to `/assessment-results`
- Uses `Toast` for error feedback and `Loading` overlays for initial load / conversation load / assessment generation.

Route wrapper:

- `app/chat/page.jsx`: wraps `ChatPage` in `<Suspense fallback={<Loading .../>}>`.

---

### Assessment components

#### `AssessmentResults` (`app/components/assessment/AssessmentPage.jsx`)

Export: default component `AssessmentResults`

- Reads assessment payload from Redux: `state.data.apiData`
- If no data is present, redirects to `/chat`
- Fetches current user location from backend once:
  - `apiClient.get("/api/v1/users/location")`
- Renders:
  - Condition summary (`possibleCondition.name`, `.description`, triggers, self care)
  - Next steps cards
  - Providers tab (includes Google Static Maps image + provider list + booking links)
  - Products tab (purchase links)
- Route:
  - `app/assessment-results/page.jsx` renders this component.

#### `AssessmentById` (`app/components/assessment/AssessmentById.jsx`)

Export: default component `AssessmentById`

- Reads `[id]` from `useParams()`
- Loads a saved assessment via:
  - `apiClient.get("/api/v1/assessments/<id>")`
  - Uses response `result?.data?.assessment`
- Also attempts to fetch location:
  - `apiClient.get("/api/v1/users/location")`
- Renders a similar UI (overview/providers/products) as `AssessmentResults`.
- Route:
  - `app/assessment/[id]/page.jsx` renders this component.

---

### User profile

#### `ProfilePage` (`app/user/page.jsx`)

Export: default component `ProfilePage`

- Guards access: if no `TokenManager.getTokens().token`, routes to `/login`
- Reads `user` from `localStorage` or `sessionStorage` and renders profile details
- Does not currently fetch user data from the backend (storage is the source of truth here).

---

### `NotFoundPage` (`app/not-found.jsx`)

Export: default component `NotFoundPage`

- Custom 404 UI linking back to `/`.

## Backend endpoints used by the UI

Below is a reference list of **backend endpoints that the frontend currently calls**. Exact response shapes are inferred from how the UI reads them.

### Auth

- **`POST /api/v1/auth/login`**
  - Used by: `app/components/login/main.jsx`
  - UI expects: `data.data.token`, `data.data.refreshToken`, optional `data.data.user`
- **`POST /api/v1/auth/register`**
  - Used by: `app/components/register/main.jsx`
- **`POST /api/v1/auth/refresh-token`**
  - Used by: `apiClient` on 401
  - Request body: `{ refreshToken }`
  - UI supports multiple response shapes:
    - `data.data.token` or `data.data.accessToken`
    - or `data.token` or `data.accessToken`
    - and `refreshToken` alongside the access token

### Chat

- **`POST /api/v1/chat/conversations/start`**
  - Used by: `HomeMain`
  - Request body: `{ message }`
  - UI reads: `res.data.conversation.id`
- **`GET /api/v1/chat/conversations?page=1&limit=12`**
  - Used by: `ChatPage`
  - UI reads: `data.conversations`
- **`GET /api/v1/chat/conversations/:id?page=1&limit=10`**
  - Used by: `ChatPage`
  - UI reads: `data.conversation` and `data.messages`
- **`POST /api/v1/chat/conversations/:id/messages`**
  - Used by: `ChatPage`
  - Request body: `{ message }`
  - UI reads reply from: `resp.data.message` (fallback: `resp.data`)

### Assessments

- **`POST /api/v1/assessments/generate`**
  - Used by: `ChatPage`
  - Request body: `{ conversationId }`
  - UI stores entire response in Redux via `setApiData(resp)`
- **`GET /api/v1/assessments`**
  - Used by: assessment header dropdown in `AssessmentResults`
  - UI reads: `res.data.assessments`
- **`GET /api/v1/assessments/:id`**
  - Used by: `AssessmentById`
  - UI reads: `res.data.assessment`

### User location

- **`PATCH /api/v1/users/location`**
  - Used by: `LocationModal` (only if user is logged in)
  - Request body: `{ latitude, longitude, city, state, country, countryCode }`
- **`GET /api/v1/users/location`**
  - Used by: `AssessmentResults`, `AssessmentById`
  - UI reads: `res.data.location`
