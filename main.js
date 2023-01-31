const textInput = document.getElementById('text');
const buildBtn = document.getElementById('build-btn');
const resetBtn = document.getElementById('reset-btn');
const treeContainer = document.getElementById('cy');
const codeTable = document.getElementById('code-table');

buildBtn.addEventListener('click', buildTree);
resetBtn.addEventListener('click', reset);


const style = [
  {
    selector: 'node',
    style: {
      "background-color": "red",
      "label": "data(id)"
    },
  },

  {
    selector: 'edge',
    style: {
      "line-color": "green",
      "width": 7,
      "label": "data(weight)",
    }
  }
];

class HuffmanNode {
  constructor(symbol, frequency) {
    this.right = null;
    this.left = null;

    this.frequency = frequency;
    this.symbol = symbol;
  }

  static printHuffmanTree(root) {
    if (root == null) {
      return;
    }

    console.log(root.symbol + '/' + root.frequency);
    this.printHuffmanTree(root.left);
    this.printHuffmanTree(root.right);
  }

  static getHuffmanCodesUtil(root, code, result) {
    if (root.right == null && root.left == null) {
      result[root.symbol] = code;
      return;
    }

    this.getHuffmanCodesUtil(root.left, code + '0', result);
    this.getHuffmanCodesUtil(root.right, code + '1', result);
  }

  static getHuffmanCodes(root) {
    let code = "";
    let result = {};

    this.getHuffmanCodesUtil(root, code, result);

    return result;
  }

  static getAllNodesOfHuffmanTree(root) {
    const huffmanTreeNodes = [];
    this.getAllNodesOfHuffmanTreeUtil(root, huffmanTreeNodes);

    return huffmanTreeNodes;
  }

  static getAllNodesOfHuffmanTreeUtil(root, huffmanTreeNodes) {
    if (root.right == null && root.left == null) {
      huffmanTreeNodes.push(root);
      return;
    }

    huffmanTreeNodes.push(root);
    this.getAllNodesOfHuffmanTreeUtil(root.left, huffmanTreeNodes);
    this.getAllNodesOfHuffmanTreeUtil(root.right, huffmanTreeNodes);
  }

  static getAllEdgesOfHuffmanTree(root) {
    const allNodesHuffmanTree = this.getAllNodesOfHuffmanTree(root);

    const edges = [];
    for (const node of allNodesHuffmanTree) {
      if (node.right != null || node.left != null) {
        
        let edge1 = null;
        let edge2 = null;

        let source = node.symbol;

        let target1 = node.left.symbol;
        let weight1 = 0;

        let target2 = node.right.symbol;
        let weight2 = 1;

        edge1 = [source, target1, weight1];
        edge2 = [source, target2, weight2];

        edges.push(edge1);
        edges.push(edge2);
      }
    }

    return edges;
  }

}

function drawHuffmanTree(root) {
  const elements = createTreeElements(root);

  // console.log(elements); empty
  var huffmanTree = cytoscape({
    container: treeContainer,

    elements: elements,

    autoungrabify: true,

    style: style,

    layout: {
      name: 'breadthfirst',
      
      roots: [`${root.symbol}`]
    }
  });
}

function createTreeElements(root) {
  let elements = [];

  const nodes = createNodes(root);
  const edges = createEdges(root);

  // console.log(nodes);

  elements = elements.concat(nodes).concat(edges);

  // console.log(elements);
  return elements;
}

function createNodes(root) {
  const huffmaniNodes = HuffmanNode.getAllNodesOfHuffmanTree(root);
  // console.log(huffmaniNodes);

  const cytoScapiNodes = huffmaniNodes.map(huffiNode => {
    return { data: { id: huffiNode.symbol } };
  });
  
  return cytoScapiNodes;

}

function createEdges(root) {
  const huffmaniEdges = HuffmanNode.getAllEdgesOfHuffmanTree(root);

  const cytoScapiEdges = huffmaniEdges.map(huffiEdge => {
    return { 
      data: { id: `${huffiEdge[0]}${huffiEdge[1]}`, source: `${huffiEdge[0]}`,
      target: `${huffiEdge[1]}`, weight: `${huffiEdge[2]}` }
    };
  });

  return cytoScapiEdges;
}

function createLetterFrequencyObject(str) {
  const sortedLetterArray = (str.split('').sort());

  let count = 0;
  let key = sortedLetterArray[0];
  const letterFrequency = {};
  for (let i = 0; i < sortedLetterArray.length; i++) {
    if (sortedLetterArray[i] == key) {
      count++;

    } else {
      letterFrequency[key] = count;
      key = sortedLetterArray[i];
      count = 0;
      i--;
    }

    letterFrequency[key] = count;
  }

  return letterFrequency

}

function buildTree() {
  const string = textInput.value;
  const letterFrequency = createLetterFrequencyObject(string);

  createTree(letterFrequency);

}


function createTree(letterFrequency) {

  const q = [];
  for (let key in letterFrequency) {
    const freq = letterFrequency[key];
    q.push(new HuffmanNode(`${key}/${freq}`, freq));
  }

  q.sort(function(node1, node2) { return node1.frequency - node2.frequency });

  let root = null;
  let countNode = 1;
  while(q.length > 1) {
    const minFrequencyNode1 = q[0];
    q.shift();

    const minFrequencyNode2 = q[0];
    q.shift();

    const frequency = minFrequencyNode1.frequency + minFrequencyNode2.frequency;
    const newNode = new HuffmanNode(`N${countNode}/${frequency}`, frequency);
    countNode++;

    newNode.left = minFrequencyNode1;
    newNode.right = minFrequencyNode2;
    
    root = newNode;
    
    q.push(newNode);
    
    q.sort(function(node1, node2) { return node1.frequency - node2.frequency });

  }
  
  drawHuffmanTree(root);
  createTable(root);
}

function reset() {
  textInput.value = '';
  treeContainer.innerHTML = '';
  codeTable.style.display = 'none';
}

// const obj = {a: 5, b: 1, c: 128};

function createTable(root) {
  const letterCodes = HuffmanNode.getHuffmanCodes(root);
  const letterFrequency = createLetterFrequencyObject(textInput.value);

  html = `<table>
  <tr>
  <th>Letter/Frequency</th>
  <th>Huffman Code</th>
  </tr>`;

  for (let letter in letterCodes) {
    html += 
    `<tr>
      <td>${letter}</td>
      <td>${letterCodes[letter]}</td>
    </tr>`
  }

  html += `</table>`;

  codeTable.style.display = 'block';
  codeTable.innerHTML = html;
}

