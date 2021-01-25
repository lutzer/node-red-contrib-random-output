module.exports = function(RED) {
  function RandomOutputNode(config) {
    RED.nodes.createNode(this, config)
      let node = this;

      node.on('input', function(msg) {
        const numberOfOutputs = node.wires.length
        
        let output = new Array(numberOfOutputs);
        output[Math.floor(Math.random()*numberOfOutputs)] = msg;
        node.send(output)
      });
  }

  RED.nodes.registerType("random-output", RandomOutputNode)
}