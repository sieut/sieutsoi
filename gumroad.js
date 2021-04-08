const GUM_CO_RE = /(https?:\/\/)?gum\.co\/([0-9a-zA-Z]+)/;
let IFRAME;

function getProductId(url) {
    const regexExec = GUM_CO_RE.exec(url);
    if (regexExec) {
        return regexExec[2];
    } else {
        return null;
    }
}

function getGumroadAnchors() {
    return Array.from(document.getElementsByTagName("a"))
        .filter((anchor) => getProductId(anchor.href) != null);
}

function injectCSS() {
    // Could load a CSS file, but gonna hard-code here because it's faster
    const style = document.createElement("style");
    style.textContent = `
        .gumroad-container {
            position: fixed !important;
            z-index: 100000 !important;
            top: 0 !important;
            right: 0 !important;
            background-color: rgba(147, 147, 147, 0.5);
        }
        .gumroad-iframe {
            position: absolute !important;
            margin: auto !important;
            top: 0; left: 0; bottom: 0; right: 0;
        }
        .gumroad-button {
            background-image: url("https://gumroad.com/button/button_bar.jpg");
            background-repeat: repeat-x;
            border-radius: 4px;
            box-shadow: rgb(0 0 0 / 40%) 0 0 2px;
            color: #999;
            font-size: 16px;
            font-family: -apple-system, ".SFNSDisplay-Regular", "Helvetica Neue", Helvetica, Arial, sans-serif;
            line-height: 50px;
            padding: 15px;
            text-decoration: none;
        }
    `;
    document.head.append(style);
}

function injectIframe() {
    const container = document.createElement("div");
    container.className = "gumroad-container";
    container.style = "width: 0px; height: 0px;";
    IFRAME = document.createElement("iframe");
    IFRAME.className = "gumroad-iframe";
    IFRAME.style = "width: 0px; height: 0px;";
    container.appendChild(IFRAME);
    document.body.appendChild(container);
    container.onclick = () => {
        container.style = "width: 0px; height: 0px;";
        IFRAME.style = "width: 0px; height: 0px;";
    }
}

function injectEventListeners(anchor) {
    anchor.onclick = (event) => {
        event.preventDefault();
        const clientHeight = document.body.clientHeight;
        const clientWidth = document.body.clientWidth;
        container.style = `width: ${clientWidth}px; height: ${clientHeight}px;`;
        IFRAME.style = `width: ${clientWidth * 0.5}px; height: ${clientHeight * 0.5}px;`;
    };
    anchor.onmouseover = () => {
        // Preload iframe on mouseover
        const url = `https://gumroad.com/l/${getProductId(anchor.href)}`
        if (IFRAME.src != url) {
            IFRAME.src = url;
        }
    }
}

window.onload = function() {
    injectCSS();
    injectIframe();
    getGumroadAnchors().forEach((anchor) => injectEventListeners(anchor));
}
