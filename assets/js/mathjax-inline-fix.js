(function (root, factory) {
  if (typeof module === "object" && module.exports) {
    module.exports = factory();
  } else {
    root.MathJaxInlineFix = factory();
  }
})(typeof window !== "undefined" ? window : this, function () {
  var TEXT_COMMANDS = ["mathrm", "text", "textrm", "texttt", "mathsf", "operatorname"];

  function escapeIdentifierUnderscores(value) {
    return value.replace(/([A-Za-z])_([A-Za-z])/g, "$1\\_$2");
  }

  function findMatchingBrace(value, openIndex) {
    var depth = 0;

    for (var index = openIndex; index < value.length; index += 1) {
      var current = value.charAt(index);
      var previous = index > 0 ? value.charAt(index - 1) : "";

      if (current === "{" && previous !== "\\") {
        depth += 1;
      } else if (current === "}" && previous !== "\\") {
        depth -= 1;

        if (depth === 0) {
          return index;
        }
      }
    }

    return -1;
  }

  function protectTextCommandArguments(mathSource) {
    var result = "";
    var cursor = 0;
    var commandPattern = new RegExp("\\\\(" + TEXT_COMMANDS.join("|") + ")\\s*\\{", "g");
    var match;

    while ((match = commandPattern.exec(mathSource)) !== null) {
      var openBrace = commandPattern.lastIndex - 1;
      var closeBrace = findMatchingBrace(mathSource, openBrace);

      if (closeBrace === -1) {
        break;
      }

      result += mathSource.slice(cursor, openBrace + 1);
      result += escapeIdentifierUnderscores(mathSource.slice(openBrace + 1, closeBrace));
      cursor = closeBrace;
      commandPattern.lastIndex = closeBrace + 1;
    }

    return result + mathSource.slice(cursor);
  }

  function protectTexIdentifierUnderscores(value) {
    return value.replace(/(\${1,2})([\s\S]*?)\1|\\\(([\s\S]*?)\\\)|\\\[([\s\S]*?)\\\]/g, function (match, dollars, dollarMath, parenMath, bracketMath) {
      if (dollars) {
        return dollars + protectTextCommandArguments(dollarMath) + dollars;
      }

      if (typeof parenMath === "string") {
        return "\\(" + protectTextCommandArguments(parenMath) + "\\)";
      }

      return "\\[" + protectTextCommandArguments(bracketMath) + "\\]";
    });
  }

  function apply(rootElement) {
    var rootNode = rootElement || document.body;
    var walker = document.createTreeWalker(rootNode, NodeFilter.SHOW_TEXT, {
      acceptNode: function (node) {
        if (!/(\$|\\\(|\\\[)/.test(node.nodeValue)) {
          return NodeFilter.FILTER_REJECT;
        }

        var parent = node.parentElement;
        while (parent) {
          if (/^(SCRIPT|STYLE|TEXTAREA|PRE|CODE)$/i.test(parent.tagName)) {
            return NodeFilter.FILTER_REJECT;
          }
          parent = parent.parentElement;
        }

        return NodeFilter.FILTER_ACCEPT;
      },
    });
    var nodes = [];
    var node;

    while ((node = walker.nextNode())) {
      nodes.push(node);
    }

    nodes.forEach(function (textNode) {
      textNode.nodeValue = protectTexIdentifierUnderscores(textNode.nodeValue);
    });
  }

  return {
    apply: apply,
    protectTexIdentifierUnderscores: protectTexIdentifierUnderscores,
  };
});
