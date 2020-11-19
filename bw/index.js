addEventListener('fetch', event => {
    event.respondWith(handleRequest(event.request))
})
/**
 * Respond with hello worker text
 * @param {Request} request
 */

sitelinks = [
    {"name": "My site", "url": "https://baileywickham.com/"},
    {"name": "My resume", "url": "https://baileywickham.com/cv"},
    {"name": "Hacker News", "url": "https://news.ycombinator.com/"}
]

async function handleRequest(request) {
    const url = new URL(request.url)
    const { pathname, search, hash } = url

    const response = await fetch("https://static-links-page.signalnerve.workers.dev", {
        headers: {
            "content-type": "text/html;charset=UTF-8",
        }
    })

    if (pathname == "/links") {
        return new Response(JSON.stringify(sitelinks), {
            headers: { 'content-type': 'application/json;charset=UTF-8' },
    })} else {
        // Rewrite html using linked .on clauses, saves lines of code 
        // compared to having a class for each replacement. 
        return new HTMLRewriter()
        .on("div", {element(elt) {
            if (elt.getAttribute("id") === "links") {
                sitelinks.forEach(e => {
                    elt.append(`<a href="${e.url}">${e.name}</a>`, {html: true})
                });
            }}})
        .on("div", {element(elt) {
            if (elt.getAttribute("id") === "profile" || elt.getAttribute("id") === "social") {
                elt.removeAttribute("style")
            }}})
        .on("img", {element(elt) {
            if (elt.getAttribute("id") === "avatar") {
                elt.setAttribute("src", "https://avatars0.githubusercontent.com/u/22156662?s=460&u=7e43f898a09ad29c5335ecb4d4ca4470c89ed6be&v=4")
            }}})
        .on("h1", {element(elt) {
            if (elt.getAttribute("id") === "name") {
                elt.append("Bailey Wickham")
            }}})
        .on("title", {element(elt) {
            elt.setInnerContent("Bailey Wickham")
        }})
        .on("div", {element(elt) {
            if (elt.getAttribute("id") === "social") {
                elt.append(`
                <a href="https://github.com/baileywickham">
                  <svg>
                  <image width="32px" height="32px" xlink:href="https://simpleicons.org/icons/github.svg"></image>
                  </svg>
                </a>`, {html: true})
            }}})
        .on("body", {element(elt) {
            // I'm no web designer
            elt.setAttribute("class", "bg-yellow-500")
        }})
        .transform(response)
    }
}