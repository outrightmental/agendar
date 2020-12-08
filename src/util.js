/*
 * Copyright (c) Outright Mental. (https://outrightmental.com) All Rights Reserved.
 */

import camelCase from "lodash/camelCase";
import kebabCase from "lodash/kebabCase";
import upperFirst from "lodash/upperFirst";
import {renderToStaticMarkup} from "react-dom/server";

/**
 Convert a word to plural

 @param word to pluralize
 @returns {string|*} plural version of word
 */
const toPlural = (word) => {
  if ("y" === word.toLowerCase().substr(-1))
    return `${word.substr(0, word.length - 1)}ies`;
  else if ("s" === word.toLowerCase().substr(-1))
    return word; // ends in s; already plural
  else
    return `${word}s`;
};

/**
 Convert a word to singular

 @param word to singularize
 @returns {string|*} singular version of word
 */
const toSingular = (word) => {
  if ("ies" === word.toLowerCase().substr(-3))
    return `${word.substr(0, word.length - 3)}y`;
  else if ("s" === word.toLowerCase().substr(-1))
    return word.substr(0, word.length - 1);
  else
    return word;
};

/**
 Convert a name to a belongs-to key, e.g. "program" or "programSequence"

 @param name to convert
 @returns {string|*} belongs-to key version of name
 */
export const toBelongsKey = (name) => {
  return camelCase(toSingular(name));
};

/**
 Convert a name to an entity type, e.g. "programs" or "program-sequences"

 @param name to convert
 @returns {string|*} type version of name
 */
export const toEntityType = (name) => {
  return toPlural(kebabCase(name))
};

/**
 Convert a name to a proper entity class name, e.g. "Program" or "ProgramSequence"

 @param name to convert
 @returns {string|*} proper entity class version of name
 */
export const toEntityName = (name) => {
  return upperFirst(camelCase(toSingular(name)));
};

/**
 Build a belongs-to property name

 @param parent entity name
 @param id of parent entity
 @returns {string|*} type version of name
 */
export const belongsTo = (parent, id) => {
  return {
    [toBelongsKey(parent)]: {data: {type: toEntityType(parent), id: id}}
  }
};

/**
 Compute the minimum value from an array of values

 @param values from which to get minimum value
 @returns {*} minimum value from array
 */
export const computeMin = (values) => {
  return values.reduce((min, p) => p < min ? p : min, values[0]);
};

/**
 Compute the maximum value from an array of values

 @param values from which to get maximum value
 @returns {*} maximum value from array
 */
export const computeMax = (values) => {
  return values.reduce((max, p) => p > max ? p : max, values[0]);
};

/**
 Compute an array of integers inclusive beginning with 0 and incrementing +1 until the maximum value
 @param max highest value to include in series
 @returns [int] series of integers inclusive from zero to maximum value
 */
export const computeSeriesFromZeroTo = (max) => {
  let series = [];
  for (let i = 0; i <= max; i++) {
    series.push(i);
  }
  return series;
};

/**
 Return the given object if the condition is true

 @param condition to evaluate
 @param obj to return if condition is true
 @param defaultValue (optional) to return if condition is false, defaults to empty string
 @returns obj if condition is true, else (optional) defaultValue, else an empty string
 */
export const visibleIf = (condition, obj, defaultValue = "") => {
  return condition ? obj : defaultValue
};

/**
 return the value if defined, else return defaultValue (optional), else null

 @param value to return if defined
 @param defaultValue (optional) defaults to null
 @returns value, else defaultValue (optional), else null
 */
export const optional = (value, defaultValue = null) => {
  return typeof value === 'undefined' ? defaultValue : value
};

/**
 Wrap an SVG object in a CSS background-image image-data url(..) string

 @param svg to wrap
 @returns string value to use as CSS background-image property value
 */
export const wrapSvgInCssImageDataUrl = (svg) => {
  const svgStr = renderToStaticMarkup(svg);
  return `url("data:image/svg+xml;utf8,${svgStr.replace(/"/g, "'")}")`;
};

/**
 Get an css rgb value string for any grayscale value

 @param value to get grayscale rgb string of
 @returns {string} rgb string of grayscale value
 */
export const rgbGray = (value) => {
  return `rgb(${value},${value},${value})`;
};

/**
 * Render an RGB color string, given an array of rgb color values, and brightness ratio
 * @param {array[number]} color
 * @param {number} brightness ratio between 0.0 and 1.0
 * @returns {string}
 */
export const toRgbString = (color, brightness) => {
  return `rgb(${color.rgb[0] * brightness},${color.rgb[1] * brightness},${color.rgb[2] * brightness})`;
}

/**
 Return a unique Id, always iterating on a globally persisted number
 Starts numbering at 99 so ids lower than that are reserved (specifically, player ids)

 @returns {number} next unique id
 */
export const nextUniqueId = () => {
  return _uniqueId++;
}

/**
 The unique id under the nextUniqueId() function
 Starts numbering at 99 so ids lower than that are reserved (specifically, player ids)

 @type {number}
 @private
 */
let _uniqueId = 99;

