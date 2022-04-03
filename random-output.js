module.exports = function(RED) {
  function RandomOutputNode(config) {
    RED.nodes.createNode(this, config)
      let node = this;
      //Elect a single node for X time
      let timeout = config.time;




      node.weights = [];
      for(let weight of config.weights){
        weight = Number(weight);
        if(isNaN(weight) || weight < 0){
          weight = 1;
        }
        node.weights.push(weight);
      }

      const numberOfOutputs = config.outputs
      node.weights = config.useWeights ? node.weights.slice(0, numberOfOutputs) : Array(numberOfOutputs).fill(1);

      node.on('input', function(msg) {
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
            //Check if this node was elected in the last "timeout" seconds.
            if(node.lastElected[outputNum] && (Date.now() - node.lastElected[outputNum]) < timeout){
              //If so, skip this output and try again.
              continue;
            }
            chosen = outputNum;
            break;
          }
        }

        output[chosen] = msg;
        node.send(output)
      });
  }

  RED.nodes.registerType("random-output-advanced", RandomOutputNode)
}