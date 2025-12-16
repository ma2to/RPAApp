# Keycloak Authentication Setup

This document describes how to enable Keycloak authentication for the RPA Advanced Table API.

## Prerequisites

- Keycloak server running (e.g., http://localhost:8080)
- A realm created in Keycloak
- A client configured for the API

## Step 1: Configure Keycloak

### 1.1 Create a Realm

1. Log in to Keycloak Admin Console
2. Create a new realm (e.g., `rpa-realm`)

### 1.2 Create a Client

1. Go to Clients → Create
2. Configure the client:
   - **Client ID**: `rpa-advanced-table`
   - **Client Protocol**: `openid-connect`
   - **Access Type**: `confidential`
   - **Valid Redirect URIs**:
     - `http://localhost:5173/*`
     - `http://localhost:5000/*`
   - **Web Origins**:
     - `http://localhost:5173`
     - `http://localhost:5000`

3. Go to the **Credentials** tab and copy the **Client Secret**

### 1.3 Create Users (Optional)

1. Go to Users → Add User
2. Set username, email, etc.
3. Go to Credentials tab and set a password

## Step 2: Configure Backend API

### 2.1 Update appsettings.json

Edit `appsettings.json` and update the Keycloak section:

```json
{
  "Keycloak": {
    "Authority": "http://localhost:8080/realms/rpa-realm",
    "Audience": "account",
    "ClientId": "rpa-advanced-table",
    "ClientSecret": "YOUR_CLIENT_SECRET_HERE",
    "RequireHttpsMetadata": false,
    "ValidateIssuer": true,
    "ValidateAudience": true,
    "ValidateLifetime": true
  }
}
```

**Replace:**
- `rpa-realm` with your realm name
- `YOUR_CLIENT_SECRET_HERE` with the actual client secret from Keycloak

### 2.2 Enable Authentication in Program.cs

In `Program.cs`, uncomment the following sections:

#### Uncomment Authentication Configuration (lines 36-71):
```csharp
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.Authority = builder.Configuration["Keycloak:Authority"];
        options.Audience = builder.Configuration["Keycloak:Audience"];
        // ... rest of the configuration
    });

builder.Services.AddAuthorization();
```

#### Uncomment Swagger JWT Configuration (lines 88-113):
```csharp
options.AddSecurityDefinition("Bearer", new Microsoft.OpenApi.Models.OpenApiSecurityScheme
{
    // ... JWT configuration for Swagger
});

options.AddSecurityRequirement(new Microsoft.OpenApi.Models.OpenApiSecurityRequirement
{
    // ... security requirement
});
```

#### Uncomment Middleware (lines ~108-109):
```csharp
app.UseAuthentication();
app.UseAuthorization();
```

### 2.3 Add [Authorize] Attributes (Optional)

Add `[Authorize]` attribute to controllers or hub methods that require authentication:

```csharp
[Authorize]
[ApiController]
[Route("api/[controller]")]
public class GridController : ControllerBase
{
    // ...
}
```

Or to specific hub methods:

```csharp
[Authorize]
public class GridHub : Hub
{
    // ...
}
```

## Step 3: Configure Frontend (Vue3)

### 3.1 Install Keycloak JS Adapter

```bash
cd frontend
npm install keycloak-js
```

### 3.2 Create Keycloak Plugin

Create `frontend/src/plugins/keycloak.ts`:

```typescript
import Keycloak from 'keycloak-js'

const keycloak = new Keycloak({
  url: 'http://localhost:8080',
  realm: 'rpa-realm',
  clientId: 'rpa-advanced-table'
})

export default keycloak
```

### 3.3 Initialize Keycloak in main.ts

```typescript
import keycloak from './plugins/keycloak'

keycloak.init({
  onLoad: 'login-required',
  checkLoginIframe: false
}).then((authenticated) => {
  if (authenticated) {
    // Create Vue app after authentication
    const app = createApp(App)
    app.mount('#app')
  }
})
```

### 3.4 Update SignalR Connection

Pass the token to SignalR:

```typescript
import keycloak from '@/plugins/keycloak'

const hubUrl = `http://localhost:5000/gridhub?access_token=${keycloak.token}`

const connection = new signalR.HubConnectionBuilder()
  .withUrl(hubUrl)
  .build()
```

### 3.5 Update Axios Configuration

Add token to HTTP requests:

```typescript
import axios from 'axios'
import keycloak from '@/plugins/keycloak'

axios.interceptors.request.use((config) => {
  if (keycloak.token) {
    config.headers.Authorization = `Bearer ${keycloak.token}`
  }
  return config
})
```

## Step 4: Test Authentication

1. Restart the backend API
2. Restart the frontend dev server
3. Open http://localhost:5173
4. You should be redirected to Keycloak login page
5. After login, you should see the grid application

## Troubleshooting

### CORS Issues

Make sure Keycloak's Web Origins are configured correctly:
- Add `http://localhost:5173` to Web Origins in the Keycloak client settings

### Token Validation Errors

- Check that the `Authority` in appsettings.json matches your Keycloak realm URL exactly
- Verify the realm name is correct
- Check Keycloak logs for more details

### SignalR Connection Issues

- Ensure the token is being passed in the query string: `?access_token=...`
- Check that `OnMessageReceived` event handler is uncommented in Program.cs
- Verify CORS settings allow credentials

## Security Best Practices

1. **Use HTTPS in Production**: Set `RequireHttpsMetadata: true`
2. **Secure Client Secret**: Store in Azure Key Vault or similar
3. **Token Refresh**: Implement token refresh logic in frontend
4. **Role-Based Access**: Use Keycloak roles for fine-grained authorization
5. **Logout**: Implement proper logout that clears tokens and sessions

## Production Checklist

- [ ] HTTPS enabled for Keycloak
- [ ] HTTPS enabled for API
- [ ] Client secret stored securely
- [ ] `RequireHttpsMetadata` set to `true`
- [ ] CORS origins restricted to production URLs only
- [ ] Token expiration configured appropriately
- [ ] Logout functionality implemented
- [ ] Role-based authorization configured
- [ ] Security headers configured (HSTS, CSP, etc.)

## Additional Resources

- [Keycloak Documentation](https://www.keycloak.org/documentation)
- [Keycloak JS Adapter](https://www.keycloak.org/docs/latest/securing_apps/#_javascript_adapter)
- [ASP.NET Core Authentication](https://learn.microsoft.com/en-us/aspnet/core/security/authentication/)
- [SignalR Authentication](https://learn.microsoft.com/en-us/aspnet/core/signalr/authn-and-authz)
