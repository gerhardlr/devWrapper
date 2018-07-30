

     class TangoDeviceWrapper extends React.Component {


     componentDidMount() {
        const namespace = '/test';
        this.socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port + namespace);
        this.handleLog({'text': 'socket connection initiated', 'time' : new Date()})
        this.socket.on('socket connected', msg => {this.handleLog({'text': 'socket connected', 'time' : new Date()})});
        this.socket.on('', msg => {})
     }

      componentWillUnmount() {
        this.socket.emit('disconnect_request');
      }


      constructor(props) {
         super(props);
         this.socket = null;
         this.state = {data: {},
         log: [{'text': 'element successfully constructed.', 'time': new Date()}]};
         this.handleLog = this.handleLog.bind(this);
      }

      handleLog(logItem) {
        this.setState(prevState => ({log : prevState.log.concat([logItem])}));
      }

      render() {
          return (
            <div>
            <h1>Tango Device Wrapper for {this.props.name}</h1>
            <Clock />
            <CustomCommand handleLog={this.handleLog} />
            <div id="log"><ListItems list = {this.state.log} /></div>
            </div>
          );
      }
    }