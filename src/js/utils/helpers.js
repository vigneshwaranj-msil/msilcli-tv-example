var Themes;
(function (Themes) {
    Themes[Themes["day"] = 0] = "day";
    Themes[Themes["night"] = 1] = "night";
})(Themes || (Themes = {}));
export function getDetailsFromURL() {
    return {};
}
export function extractCssUrl() {
    let link = document.querySelector("link[rel='stylesheet']");
    if (link) {
        return link.href;
    }
    return "";
}
