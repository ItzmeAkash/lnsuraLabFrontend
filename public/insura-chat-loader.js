/**
 * Insura Chat — embed loader for third-party websites
 *
 * Partners only add this (host is read from the script URL automatically):
 *
 * <script src="https://YOUR-DOMAIN.com/insura-chat-loader.js" async></script>
 */
(function () {
  var script = document.currentScript;
  if (!script || !script.src) {
    console.error("[Insura Chat] Could not find script tag.");
    return;
  }

  var host;
  try {
    host = new URL(script.src).origin;
  } catch (e) {
    console.error("[Insura Chat] Invalid script src.");
    return;
  }

  var iframeId = "insura-chat-embed-iframe";
  if (document.getElementById(iframeId)) return;

  var iframe = document.createElement("iframe");
  iframe.id = iframeId;
  iframe.title = "Insura Chat";
  iframe.src = host + "/embed/chat";
  iframe.setAttribute("allow", "clipboard-write");
  iframe.style.cssText = [
    "position:fixed",
    "bottom:0",
    "right:0",
    "width:420px",
    "height:min(720px,100vh)",
    "max-width:100vw",
    "border:none",
    "background:transparent",
    "z-index:2147483647",
    "color-scheme:light",
  ].join(";");

  document.body.appendChild(iframe);
})();
