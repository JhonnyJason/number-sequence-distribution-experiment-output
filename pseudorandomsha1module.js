// Generated by CoffeeScript 2.5.1
(function() {
  var NR_OF_INDICES, butl, chunkMapping, crypto, indexSequence, indexedChunks, log, nextChunk, olog, ostr, print, pseudorandomsha1module, uint16ToHex;

  pseudorandomsha1module = {
    name: "pseudorandomsha1module"
  };

  //###########################################################
  //region printLogFunctions
  log = function(arg) {
    if (allModules.debugmodule.modulesToDebug["pseudorandomsha1module"] != null) {
      console.log("[pseudorandomsha1module]: " + arg);
    }
  };

  ostr = function(obj) {
    return JSON.stringify(obj, null, 4);
  };

  olog = function(obj) {
    return log("\n" + ostr(obj));
  };

  print = function(arg) {
    return console.log(arg);
  };

  //endregion

  //###########################################################
  crypto = require("crypto");

  butl = require("thingy-byte-utils");

  //###########################################################
  NR_OF_INDICES = 256;

  indexedChunks = [];

  chunkMapping = {};

  //###########################################################
  pseudorandomsha1module.initialize = function() {
    log("pseudorandomsha1module.initialize");
  };

  //###########################################################
  nextChunk = function(prev) {
    return crypto.createHash('sha1').update(prev).digest();
  };

  indexSequence = function(sequenceBuffer, distance, size) {
    var byte, chunk, i, j, label, len, ref;
    ref = distance;
    for ((ref > 0 ? (i = j = 0, len = sequenceBuffer.length) : i = j = sequenceBuffer.length - 1); ref > 0 ? j < len : j >= 0; i = j += ref) {
      byte = sequenceBuffer[i];
      chunk = sequenceBuffer.slice(i, i + size);
      label = chunk.toString("hex");
      chunkMapping[label] = indexedChunks.push(chunk);
    }
  };

  uint16ToHex = function(num) {
    var buf, result;
    buf = Buffer.alloc(2);
    buf.writeUInt16BE(num);
    result = buf.toString("hex");
    // olog {num, result}
    return result;
  };

  //###########################################################
  pseudorandomsha1module.createSequenceMapping = function(seed, chunkSize, indexDistance) {
    var allChunks, chunk, currentLength, requiredLength, sequenceBuffer;
    log("pseudorandomsha1module.createSequenceMapping");
    if (typeof seed === "object") {
      seed = Buffer.from(seed);
    }
    if (typeof seed === "number") {
      seed = "" + seed;
    }
    if (typeof seed === "string") {
      seed = butl.utf8ToBytes(seed);
    }
    chunk = seed;
    requiredLength = NR_OF_INDICES * indexDistance + chunkSize;
    allChunks = [];
    currentLength = 0;
    while (true) {
      chunk = nextChunk(chunk);
      currentLength += chunk.length;
      allChunks.push(chunk);
      if (currentLength >= requiredLength) {
        break;
      }
    }
    sequenceBuffer = Buffer.concat(allChunks);
    indexSequence(sequenceBuffer, indexDistance, chunkSize);
  };

  // olog chunkMapping
  pseudorandomsha1module.getMatchingFactor = function(allChunks) {
    var allLabels, index, j, label, len, matched, num;
    matched = 0;
    allLabels = (function() {
      var j, len, results;
      results = [];
      for (j = 0, len = allChunks.length; j < len; j++) {
        num = allChunks[j];
        results.push(uint16ToHex(num));
      }
      return results;
    })();
// olog allLabels
    for (j = 0, len = allLabels.length; j < len; j++) {
      label = allLabels[j];
      index = chunkMapping[label];
      if (index != null) {
        matched++;
      }
    }
    log(matched);
    log(allChunks.length);
    return 1.0 * matched / allChunks.length;
  };

  module.exports = pseudorandomsha1module;

}).call(this);
