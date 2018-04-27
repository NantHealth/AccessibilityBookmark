import axe from "axe-core";
import styles from "./styles.css";

const addStyles = ()=>{
    const styleElement = document.createElement("style");
    styleElement.innerHTML = styles.toString();
    document.head.appendChild(styleElement)
}
const addActionButton = ()=>{
    addStyles();
    //add action button
const svg = `<svg role="presentation" fill="#000000" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
<path d="M0 0h24v24H0z" fill="none"/>
<path d="M12 2c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2zm9 7h-6v13h-2v-6h-2v6H9V9H3V7h18v2z"/>
</svg>`;
    const button = document.createElement("button");
    button.classList.add("accessibility-bookmarklet-action-button");
    button.setAttribute("aria-label","Click run test page for accessibility");
    button.innerHTML = svg;
    document.body.appendChild(button);
    button.addEventListener("click", buttonClicked);
}
let executing = undefined;
const buttonClicked = ()=>{
    if(executing){
        return;
    }
    executing = true;
    closeDrawer();
    axe.run({
        exclude:[[".accessibility-bookmarklet-action-button"]]
    },{
        runOnly: {
            type: "tag",
            values: ["wcag2a", "wcag2aa"]
        }
    }).then((results)=>{
        showViolations(results.violations);
    })
    .then(()=>{
        executing = false;
    })
    .catch((e)=>{
        console.error(e)
        executing = false;
    });
}
const toElement = (str)=>{
    const temp = document.createElement("div");
    temp.innerHTML = str;
    return temp.firstElementChild;
}
const closeDrawer = (e)=>{
    if(e){
        e.preventDefault();
        e.stopPropagation();
    }
    const drawer = document.querySelector(".accessibility-bookmarklet-results");
    if(drawer) drawer.remove();
}
const createDrawer = ()=>{
    const div = document.createElement("div");
   div.classList.add("accessibility-bookmarklet-results");
   const close = document.createElement("a");
   close.href="#";
   close.setAttribute("aria-label","Click to close results");
   close.innerHTML = "&times;";
   close.classList.add("close");
   close.addEventListener("click",closeDrawer);
   div.appendChild(close);
   return div;
}
const showViolations = (violations)=>{
    if(violations.length ===0){
        return showNoViolations();
    }
    const createLi = (violation) =>`<li>
            <h3>${violation.description}</h3>
            <p>${violation.help}</p>
            ${violation.nodes.map(createNode).join("")}
        </li>`
    const createNode = node =>{
        const title = `<h4 class="node">${node.target.join(", ")}</h4>`;
        const arrayOfStrings = [];
        node.failureSummary.split("\n").forEach(txt=>{
            if(!txt.length){
                arrayOfStrings.push(`</ul>`);
                return
            }
            if(txt.lastIndexOf(":") === txt.length-1){
                arrayOfStrings.push(`<h5>${txt}</h5><ul>`);
                return;
            }
            if(txt.length){
                arrayOfStrings.push(`<li>${txt}</li>`);
                return;
            }
            
        });
        arrayOfStrings.push(`</ul>`);
        return `${title} ${arrayOfStrings.join("")}`
     }
    const ul =  `
    <ul class="accessibility-violations-list">
        ${violations.map(createLi).join(" ")}
    </ul>
    `;
    const drawer = createDrawer();
    drawer.appendChild(toElement(ul));
    document.body.appendChild(drawer);
    return drawer;
}

const showNoViolations = ()=>{
    const drawer = createDrawer();
    drawer.appendChild(toElement(`<h1>Horray no violations</h1>`));
    document.body.appendChild(drawer);
    return drawer;
}

addActionButton();  