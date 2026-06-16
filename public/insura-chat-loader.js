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

  var chatbotName =
    script.getAttribute("data-chatbot-name") ||
    script.getAttribute("data-chatbot") ||
    "";
  var brokerName =
    script.getAttribute("data-broker-name") ||
    script.getAttribute("data-broker") ||
    "";
  var partnerId =
    script.getAttribute("data-partner-id") ||
    script.getAttribute("data-partner") ||
    "";

  var iframeId = "insura-chat-embed-iframe";
  var COLLAPSED_SIZE = 88;

  function applyIframeSize(iframe, width, height) {
    iframe.style.width = width + "px";
    iframe.style.height = height + "px";
  }

  function mountIframe() {
    if (document.getElementById(iframeId)) return;

    var embedParams = new URLSearchParams();
    if (chatbotName.trim()) embedParams.set("chatbot", chatbotName.trim());
    if (brokerName.trim()) embedParams.set("broker", brokerName.trim());
    if (partnerId.trim()) embedParams.set("partner", partnerId.trim());
    var embedQuery = embedParams.toString();
    var embedPath = "/embed/chat" + (embedQuery ? "?" + embedQuery : "");

    var iframe = document.createElement("iframe");
    iframe.id = iframeId;
    iframe.title = "Insura Chat";
    iframe.src = host + embedPath;
    iframe.setAttribute("allow", "clipboard-write");
    iframe.style.cssText = [
      "position:fixed",
      "bottom:0",
      "right:0",
      "width:" + COLLAPSED_SIZE + "px",
      "height:" + COLLAPSED_SIZE + "px",
      "max-width:100vw",
      "border:none",
      "background:transparent",
      "background-color:transparent",
      "overflow:hidden",
      "z-index:2147483647",
      "color-scheme:light",
    ].join(";");

    window.addEventListener("message", function (event) {
      if (event.origin !== host) return;
      var data = event.data;
      if (!data || data.type !== "insura-chat:resize") return;
      if (typeof data.width !== "number" || typeof data.height !== "number") return;
      applyIframeSize(iframe, data.width, data.height);
    });

    document.body.appendChild(iframe);
  }

  if (document.body) {
    mountIframe();
  } else {
    document.addEventListener("DOMContentLoaded", mountIframe);
  }
})();
