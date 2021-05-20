module.exports = function(RED) {
  function RandomOutputNode(config) {
    RED.nodes.createNode(this, config)
      let node = this;
      node.weights = [];
      for(let weight of config.weights){
        weight = Number(weight);
        if(isNaN(weight) || weight < 0){
          weight = 1;
        }
        node.weights.push(weight);
      }
      node.weights = node.weights.slice(0, node.wires.length);

      node.on('input', function(msg) {
        const numberOfOutputs = node.wires.length
        let output = new Array(numberOfOutputs);

        let weightSum = node.weights.reduce((a, b) => a + b, 0);
        if(weightSum <= 0){
          node.weights.fill(0, 1);
          weightSum = numberOfOutputs;
        }

        const randVal = Math.random() * weightSum;
        let weightAggregate = 0;
        let chosen;
        for(let outputNum = 0; outputNum < numberOfOutputs; outputNum++){
          weightAggregate += node.weights[outputNum];
          if(randVal < weightAggregate){
            chosen = outputNum;
            break;
          }
        }

        output[chosen] = msg;
        node.send(output)
      });
  }

  RED.nodes.registerType("random-output", RandomOutputNode)
}