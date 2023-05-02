const redis = require('redis');

const PUB_SUB_CHANNELS = {
  TEST: 'TEST',
  BLOCKCHAIN: "BLOCKCHAIN",
  TRANSACTION: "TRANSACTION"
};

class PubSub{
  constructor({blockchain, transactionPool}){
    this.chain = blockchain;
    this.transactionPool = transactionPool;


    this.publishingClient = redis.createClient();
    this.subscribingClient = redis.createClient();

    this.onChannelSubscription();


    //event
    this.subscribingClient.on('message', 
    (channel, message)=>this.messageHandler(channel, message)
    );
  }

  messageHandler(channel, message){
    console.log(`Message received. Channel: ${channel}. Message ${message}`);

    const parsedMessage = JSON.parse(message)

    if(channel === PUB_SUB_CHANNELS.BLOCKCHAIN){
      this.chain.changeChain(parsedMessage,true, () =>{
        this.transactionPool.clearBlockchainTransactions({
          chain: parsedMessage
        });
      });
    };

    if(channel === PUB_SUB_CHANNELS.TRANSACTION){
      this.transactionPool.storeTransaction(parsedMessage);
    };
  };
  ///call the function subscribe on each channels
  onChannelSubscription(){
    Object.values(PUB_SUB_CHANNELS).forEach(channel =>{
      this.subscribingClient.subscribe(channel)
    } )
  }

  publishToChannel({channel, message}){
    //ensure the current subscriber does not get the new message that he is broadcasting to other channel
    //by unsubscribe to the channel send pubblish the message and than re-subscribing again back
    this.subscribingClient.unsubscribe(channel, () =>{
      this.publishingClient.publish(channel, message, () =>{
        this.subscribingClient.subscribe(channel);
      });
    })
    
  }

  broadcastUpdatedBlockchain(){
    this.publishToChannel({
      channel: PUB_SUB_CHANNELS.BLOCKCHAIN,
      message: JSON.stringify(this.chain.chain)
    });
  }

  broadcastTransaction(transaction){
    this.publishToChannel({
      channel:PUB_SUB_CHANNELS.TRANSACTION,
      message: JSON.stringify(transaction)
    });
  }
}

// const testPubsub = new PubSub();

// setTimeout(() => testPubsub.publisher.publish(CHANNELS.TEST, 'foo'), 1000);

module.exports = PubSub;