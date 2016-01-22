(function () {
     'use strict';


    // Declare app level module which depends on filters, and services
    var app = angular.module('webhooksio', [
        'webhooksio.filters',
        'webhooksio.services',
        'webhooksio.directives',
        'webhooksio.controllers'
    ]);

    app.run(function ($rootScope) {

      $rootScope.resizeFrame = function($padding) {
        // If there are any additional elements added, we will need to resize again...
          var container_height = $('.container-fluid').height();
          var footer_height = $('#footer').height();
          var adjust = $padding || 0;
          var height = container_height + footer_height + adjust;
          window.parent.postMessage(height, '*');
      };

      $rootScope.showMessage = function($opts) {
        $.gritter.add($opts);
      };

      $rootScope.relativeDateFormat = function($date, $format) {
        var $rtnDate = moment();
        var $currentDate = moment();
        if($format.length) {
            $rtnDate = moment($date, $format);
        } else {
            $rtnDate = moment($date);
        }

        // Only use relative dates if less than 45 minutes ago.
        if($currentDate.format('X') > $rtnDate.format('X') && ($currentDate.format('X') - $rtnDate.format('X')) < 2700) {
            return $rtnDate.fromNow();
        } else {
            return $rtnDate.utc().format('MMM Do YYYY HH:mm:ss UTC');
        }

        
      };


      $rootScope.parseMarkdown = function (s) {
        var r = s, ii, pre1 = [], pre2 = [];

        // detect newline format
        var newline = r.indexOf('\r\n') != -1 ? '\r\n' : r.indexOf('\n') != -1 ? '\n' : '';
        
        // store {{{ unformatted blocks }}} and &lt;pre> pre-formatted blocks &lt;/pre>
        r = r.replace(/{{{([\s\S]*?)}}}/g, function (x) { pre1.push(x.substring(3, x.length - 3)); return '{{{}}}'; });
        r = r.replace(new RegExp('&lt;pre>([\\s\\S]*?)&lt;/pre>', 'gi'), function (x) { pre2.push(x.substring(5, x.length - 6)); return '&lt;pre>&lt;/pre>'; });
        
        // h1 - h4 and hr
        r = r.replace(/^==== (.*)=*/gm, '&lt;h4>$1&lt;/h4>');
        r = r.replace(/^=== (.*)=*/gm, '&lt;h3>$1&lt;/h3>');
        r = r.replace(/^== (.*)=*/gm, '&lt;h2>$1&lt;/h2>');
        r = r.replace(/^= (.*)=*/gm, '&lt;h1>$1&lt;/h1>');
        r = r.replace(/^[-*][-*][-*]+/gm, '&lt;hr>');
        
        // bold, italics, and code formatting
        r = r.replace(/\*\*(.*?)\*\*/g, '&lt;strong>$1&lt;/strong>');
        r = r.replace(new RegExp('//(((?!https?://).)*?)//', 'g'), '&lt;em>$1&lt;/em>');
        r = r.replace(/``(.*?)``/g, '&lt;code>$1&lt;/code>');
        
        // unordered lists
        r = r.replace(/^\*\*\*\* (.*)/gm, '&lt;ul>&lt;ul>&lt;ul>&lt;ul>&lt;li>$1&lt;/li>&lt;/ul>&lt;/ul>&lt;/ul>&lt;/ul>');
        r = r.replace(/^\*\*\* (.*)/gm, '&lt;ul>&lt;ul>&lt;ul>&lt;li>$1&lt;/li>&lt;/ul>&lt;/ul>&lt;/ul>');
        r = r.replace(/^\*\* (.*)/gm, '&lt;ul>&lt;ul>&lt;li>$1&lt;/li>&lt;/ul>&lt;/ul>');
        r = r.replace(/^\* (.*)/gm, '&lt;ul>&lt;li>$1&lt;/li>&lt;/ul>');
        for (ii = 0; ii < 3; ii++) r = r.replace(new RegExp('&lt;/ul>' + newline + '&lt;ul>', 'g'), newline);
        
        // ordered lists
        r = r.replace(/^#### (.*)/gm, '&lt;ol>&lt;ol>&lt;ol>&lt;ol>&lt;li>$1&lt;/li>&lt;/ol>&lt;/ol>&lt;/ol>&lt;/ol>');
        r = r.replace(/^### (.*)/gm, '&lt;ol>&lt;ol>&lt;ol>&lt;li>$1&lt;/li>&lt;/ol>&lt;/ol>&lt;/ol>');
        r = r.replace(/^## (.*)/gm, '&lt;ol>&lt;ol>&lt;li>$1&lt;/li>&lt;/ol>&lt;/ol>');
        r = r.replace(/^# (.*)/gm, '&lt;ol>&lt;li>$1&lt;/li>&lt;/ol>');
        for (ii = 0; ii < 3; ii++) r = r.replace(new RegExp('&lt;/ol>' + newline + '&lt;ol>', 'g'), newline);
        
        // links
        r = r.replace(/\[\[(http:[^\]|]*?)\]\]/g, '&lt;a target="_blank" href="$1">$1&lt;/a>');
        r = r.replace(/\[\[(http:[^|]*?)\|(.*?)\]\]/g, '&lt;a target="_blank" href="$1">$2&lt;/a>');
        r = r.replace(/\[\[([^\]|]*?)\]\]/g, '&lt;a href="$1">$1&lt;/a>');
        r = r.replace(/\[\[([^|]*?)\|(.*?)\]\]/g, '&lt;a href="$1">$2&lt;/a>');
        
        // images
        r = r.replace(/{{([^\]|]*?)}}/g, '&lt;img src="$1">');
        r = r.replace(/{{([^|]*?)\|(.*?)}}/g, '&lt;img src="$1" alt="$2">');
        
        // video
        r = r.replace(/&lt;&lt;(.*?)>>/g, '&lt;embed class="video" src="$1" allowfullscreen="true" allowscriptaccess="never" type="application/x-shockwave/flash">&lt;/embed>');
        
        // hard linebreak if there are 2 or more spaces at the end of a line
        r = r.replace(new RegExp(' + ' + newline, 'g'), '&lt;br>' + newline);
        
        // split on double-newlines, then add paragraph tags when the first tag isn't a block level element
        if (newline !== '') for (var p = r.split(newline + newline), i = 0; i < p.length; i++) {
            var blockLevel = false;
            if (p[i].length >= 1 && p[i].charAt(0) == '&lt;') {
                // check if the first tag is a block-level element
                var firstSpace = p[i].indexOf(' '), firstCloseTag = p[i].indexOf('>');
                var endIndex = firstSpace > -1 && firstCloseTag > -1 ? Math.min(firstSpace, firstCloseTag) : firstSpace > -1 ? firstSpace : firstCloseTag;
                var tag = p[i].substring(1, endIndex).toLowerCase();
                for (var j = 0; j < blockLevelElements.length; j++) if (blockLevelElements[j] == tag) blockLevel = true;
            } else if (p[i].length >= 1 && p[i].charAt(0) == '|') {
                // format the paragraph as a table
                blockLevel = true;
                p[i] = p[i].replace(/ \|= /g, '&lt;/th>&lt;th>').replace(/\|= /g, '&lt;tr>&lt;th>').replace(/ \|=/g, '&lt;/th>&lt;/tr>');
                p[i] = p[i].replace(/ \| /g, '&lt;/td>&lt;td>').replace(/\| /g, '&lt;tr>&lt;td>').replace(/ \|/g, '&lt;/td>&lt;/tr>');
                p[i] = '&lt;table>' + p[i] + '&lt;/table>';
            } else if (p[i].length >= 2 && p[i].charAt(0) == '>' && p[i].charAt(1) == ' ') {
                // format the paragraph as a blockquote
                blockLevel = true;
                p[i] = '&lt;blockquote>' + p[i].replace(/^> /gm, '') + '&lt;/blockquote>';
            }
            if (!blockLevel) p[i] = '&lt;p>' + p[i] + '&lt;/p>';
        }
        
        // reassemble the paragraphs
        if (newline !== '') r = p.join(newline + newline);
        
        // restore the preformatted and unformatted blocks
        r = r.replace(new RegExp('&lt;pre>&lt;/pre>', 'g'), function (match) { return '&lt;pre>' + pre2.shift() + '&lt;/pre>'; });
        r = r.replace(/{{{}}}/g, function (match) { return pre1.shift(); });
        return r;
    };





    });
 }());