<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>ISI-Eco Report — Documentation API</title>
    <meta name="description" content="Documentation interactive de l'API ISI-Eco Report v2.2.0" />
    <link rel="stylesheet" href="https://unpkg.com/swagger-ui-dist@5/swagger-ui.css" />
    <style>
        * { box-sizing: border-box; margin: 0; padding: 0; }

        body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            background: #0f1117;
            color: #e2e8f0;
            min-height: 100vh;
        }

        /* ── Top bar ── */
        .topbar {
            background: linear-gradient(135deg, #1a1f2e 0%, #111827 100%);
            border-bottom: 1px solid rgba(52, 211, 153, 0.2);
            padding: 0 2rem;
            display: flex;
            align-items: center;
            justify-content: space-between;
            height: 64px;
            position: sticky;
            top: 0;
            z-index: 100;
            backdrop-filter: blur(12px);
        }

        .topbar-logo {
            display: flex;
            align-items: center;
            gap: 0.75rem;
        }

        .topbar-logo .icon {
            width: 36px;
            height: 36px;
            background: linear-gradient(135deg, #34d399, #059669);
            border-radius: 10px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 18px;
            box-shadow: 0 0 16px rgba(52, 211, 153, 0.4);
        }

        .topbar-logo h1 {
            font-size: 1rem;
            font-weight: 700;
            color: #f1f5f9;
            letter-spacing: -0.02em;
        }

        .topbar-logo span {
            font-size: 0.75rem;
            color: #34d399;
            font-weight: 500;
        }

        .topbar-meta {
            display: flex;
            align-items: center;
            gap: 1rem;
        }

        .badge {
            padding: 4px 10px;
            border-radius: 99px;
            font-size: 0.7rem;
            font-weight: 600;
            letter-spacing: 0.05em;
            text-transform: uppercase;
        }

        .badge-green  { background: rgba(52,211,153,0.15); color: #34d399; border: 1px solid rgba(52,211,153,0.3); }
        .badge-blue   { background: rgba(96,165,250,0.15); color: #60a5fa; border: 1px solid rgba(96,165,250,0.3); }

        .spec-link {
            display: flex;
            align-items: center;
            gap: 0.4rem;
            font-size: 0.78rem;
            color: #94a3b8;
            text-decoration: none;
            padding: 6px 12px;
            border-radius: 8px;
            border: 1px solid rgba(255,255,255,0.08);
            transition: all .2s;
        }
        .spec-link:hover { color: #f1f5f9; background: rgba(255,255,255,0.05); }

        /* ── Swagger wrapper ── */
        #swagger-ui {
            max-width: 1200px;
            margin: 0 auto;
            padding: 2rem 1.5rem 4rem;
        }

        /* ── Dark-mode overrides ── */
        .swagger-ui .topbar { display: none !important; }

        .swagger-ui { color: #e2e8f0 !important; }

        .swagger-ui .info .title,
        .swagger-ui .info h1,
        .swagger-ui .info h2,
        .swagger-ui .info h3 { color: #f1f5f9 !important; }

        .swagger-ui .info .description p,
        .swagger-ui .info .description { color: #94a3b8 !important; }

        .swagger-ui .scheme-container,
        .swagger-ui section.models { background: #1a1f2e !important; border: 1px solid rgba(255,255,255,0.07) !important; border-radius: 12px !important; }

        .swagger-ui .opblock-tag {
            color: #f1f5f9 !important;
            border-bottom: 1px solid rgba(255,255,255,0.07) !important;
        }

        .swagger-ui .opblock {
            border-radius: 10px !important;
            margin-bottom: 8px !important;
            border: 1px solid rgba(255,255,255,0.06) !important;
        }

        .swagger-ui .opblock.opblock-get    { background: rgba(96,165,250,0.06)  !important; border-color: rgba(96,165,250,0.2)  !important; }
        .swagger-ui .opblock.opblock-post   { background: rgba(52,211,153,0.06)  !important; border-color: rgba(52,211,153,0.2)  !important; }
        .swagger-ui .opblock.opblock-put    { background: rgba(251,191,36,0.06)  !important; border-color: rgba(251,191,36,0.2)  !important; }
        .swagger-ui .opblock.opblock-delete { background: rgba(248,113,113,0.06) !important; border-color: rgba(248,113,113,0.2) !important; }

        .swagger-ui .opblock .opblock-summary-method {
            border-radius: 6px !important;
            font-size: 0.7rem !important;
            font-weight: 700 !important;
            min-width: 60px !important;
        }

        .swagger-ui .opblock-summary-path,
        .swagger-ui .opblock-summary-path__deprecated { color: #e2e8f0 !important; }

        .swagger-ui .opblock-summary-description { color: #94a3b8 !important; }

        .swagger-ui .opblock-body,
        .swagger-ui .opblock-section,
        .swagger-ui .response-col_status,
        .swagger-ui table thead tr th,
        .swagger-ui .parameter__name,
        .swagger-ui .parameter__type { color: #cbd5e1 !important; }

        .swagger-ui select,
        .swagger-ui input[type=text],
        .swagger-ui textarea {
            background: #0f1117 !important;
            color: #e2e8f0 !important;
            border-color: rgba(255,255,255,0.15) !important;
            border-radius: 8px !important;
        }

        .swagger-ui .btn.authorize {
            background: linear-gradient(135deg, #34d399, #059669) !important;
            border-color: transparent !important;
            color: #fff !important;
            border-radius: 8px !important;
            font-weight: 600 !important;
        }

        .swagger-ui .btn.execute {
            background: linear-gradient(135deg, #60a5fa, #3b82f6) !important;
            border-color: transparent !important;
            color: #fff !important;
            border-radius: 8px !important;
        }

        .swagger-ui .response-control-media-type--accept-controller select { background: #1a1f2e !important; }

        .swagger-ui .model-box { background: #1a1f2e !important; border-radius: 8px !important; }
        .swagger-ui .model { color: #94a3b8 !important; }
        .swagger-ui .prop-type { color: #34d399 !important; }

        .swagger-ui .highlight-code pre,
        .swagger-ui .microlight { background: #0f1117 !important; border-radius: 8px !important; color: #a5f3c0 !important; }

        .swagger-ui .responses-table .response:first-child { border-radius: 8px 8px 0 0 !important; }

        /* Loading animation */
        #loading {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            height: 60vh;
            gap: 1.5rem;
            color: #64748b;
        }
        .spinner {
            width: 40px; height: 40px;
            border: 3px solid rgba(52,211,153,0.2);
            border-top-color: #34d399;
            border-radius: 50%;
            animation: spin 0.8s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }
    </style>
</head>
<body>

<nav class="topbar">
    <div class="topbar-logo">
        <div class="icon">🌿</div>
        <div>
            <h1>ISI-Eco Report</h1>
            <span>Documentation API v2.2.0</span>
        </div>
    </div>
    <div class="topbar-meta">
        <span class="badge badge-green">Laravel 13</span>
        <span class="badge badge-blue">OpenAPI 3.0</span>
        <a class="spec-link" href="/docs/openapi.json" target="_blank">
            ⬇ openapi.json
        </a>
        <a class="spec-link" href="/docs/openapi.yaml" target="_blank">
            ⬇ openapi.yaml
        </a>
    </div>
</nav>

<div id="loading">
    <div class="spinner"></div>
    <p>Chargement de la documentation…</p>
</div>

<div id="swagger-ui" style="display:none"></div>

<script src="https://unpkg.com/swagger-ui-dist@5/swagger-ui-bundle.js"></script>
<script>
    window.onload = function () {
        SwaggerUIBundle({
            url: '/docs/openapi.json',
            dom_id: '#swagger-ui',
            presets: [
                SwaggerUIBundle.presets.apis,
                SwaggerUIBundle.SwaggerUIStandalonePreset
            ],
            layout: 'BaseLayout',
            deepLinking: true,
            displayRequestDuration: true,
            filter: true,
            tryItOutEnabled: true,
            persistAuthorization: true,
            onComplete: function () {
                document.getElementById('loading').style.display = 'none';
                document.getElementById('swagger-ui').style.display = 'block';
            }
        });
    };
</script>
</body>
</html>
