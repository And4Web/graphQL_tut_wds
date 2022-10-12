const express = require('express');
const app = express();
const PORT = process.env.PORT || 5000;

const {graphqlHTTP} = require('express-graphql');
const {buildSchema} = require('graphql');

app.use('/graphql', graphqlHTTP({
  // graphiql: true
}))

app.get('/', (req, res) => {
  res.send('This is the first response from the server');
})

app.listen(PORT, () => console.log(`Server is running at PORT: ${PORT}`))