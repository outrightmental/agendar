import React from "react";

const CONTENT_ID_PREFIX = "static-content-";

// Initialize by cutting all content found in index.html
let contentMap = {};
let els = document.querySelectorAll(`[id^=${CONTENT_ID_PREFIX}]`);
for (let i = 0; i < els.length; i++) cutContentFrom(els[i].id.replace(CONTENT_ID_PREFIX, ""));

export function Content(props) {
  let name = props.name;
  return (
    <div className="container" dangerouslySetInnerHTML={{
      __html: `<div class="container">${contentMap[name]}</div>`
    }}/>
  );
}

function cutContentFrom(key) {
  let el = document.getElementById(`${CONTENT_ID_PREFIX}${key}`);
  contentMap[key] = `${el.innerHTML}`;
  el.remove();
}

