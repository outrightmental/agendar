// Copyright (C) 2020 Outright Mental

// Copyleft 2020 Outright Mental

import React from "react";

/*
 Actual content is defined in /public/index.html so that search engines can index it!
 This component scrapes the elements with ids beginning with the prefix, caches the content and deletes the tags.
 */

const CONTENT_ID_PREFIX = "static-content-";

// Initialize by cutting all content found in index.html
let contentMap = {};
let els = document.querySelectorAll(`[id^=${CONTENT_ID_PREFIX}]`);
for (let i = 0; i < els.length; i++) cutContentFrom(els[i].id.replace(CONTENT_ID_PREFIX, ""));

const Content = function (props) {
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

export default Content;