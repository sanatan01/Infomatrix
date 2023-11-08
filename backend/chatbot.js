const tf = require('@tensorflow/tfjs-node');
const readline = require('readline');
const dataset = require('./dataset.json');


function createNeuralNetwork() {
  // Define your neural network architecture here
  const model = tf.sequential();
  model.add(tf.layers.dense({ units: 64, activation: 'relu', inputShape: [10] }));
  model.add(tf.layers.dense({ units: 64, activation: 'relu' }));
  model.add(tf.layers.dense({ units: 3, activation: 'softmax' }));
  return model;
}

function trainModel(data) {
  // Train your model with the provided data
  const xs = tf.tensor(data.inputs);
  const ys = tf.tensor(data.outputs);
  const model = createNeuralNetwork();
  model.compile({ optimizer: 'sgd', loss: 'meanSquaredError' });
  model.fit(xs, ys, { epochs: 10 }).then(() => {
    console.log('Training completed.');
  });
}

function predict(inputData) {
  // Make predictions using your trained model
  const model = createNeuralNetwork();
  const inputTensor = tf.tensor(inputData);
  const outputTensor = model.predict(inputTensor);
  const predictions = outputTensor.arraySync();
  return predictions;
}


for (const intent of dataset.intents) {
  intent.patterns = intent.patterns.map(pattern => pattern.toLowerCase());
  // You can also convert other text data to lowercase, if needed.
}

// Function to find the best matching intent for user input
function findIntent(userInput) {
  userInput = userInput.toLowerCase(); // Convert user input to lowercase
  let bestIntent = "default";
  let bestScore = 0;

  for (const intent of dataset.intents) {
    for (const pattern of intent.patterns) {
      const score = similarity(userInput, pattern);
      if (score > bestScore) {
        bestIntent = intent;
        bestScore = score;
      }
    }
  }

  return bestIntent;
}

// Function to calculate similarity between two strings (simple approach)
function similarity(s1, s2) {
  const set1 = new Set(s1.split(' '));
  const set2 = new Set(s2.split(' '));

  const intersection = new Set([...set1].filter(x => set2.has(x)));
  return intersection.size / set2.size;
}

// Initialize the readline interface for user input
// const rl = readline.createInterface({
//   input: process.stdin,
//   output: process.stdout
// });

function chatResponse(userInput) {
  if (!userInput) {
    // console.log("Chatbot: I didn't detect any input. Please ask a question.");
    return "I didn't detect any input. Please ask a question."
    // chat();
    // return;
  }

  const intent = findIntent(userInput);

  if (intent.intent === "default") {
    // console.log("Chatbot: I don't know the answer to that. Please ask something else.");
    return "I don't know the answer to that. Please ask something else."
  } else {
    const responses = intent.responses;
    if (responses && responses.length > 0) {
      const response = responses[Math.floor(Math.random() * responses.length)];
      console.log(`Chatbot: ${response}`);
      return response
    } else {
      // console.log("Chatbot: I don't have a response for that. Please ask something else.");
      return "I don't have a response for that. Please ask something else."
    }
  }
}

module.exports = chatResponse
