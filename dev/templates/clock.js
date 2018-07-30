
export class Clock extends React.Component {
    componentDidMount() {
        this.timerID = setInterval(
        () => this.tick(),
        1000);
    }

    componentWillUnmount() {
        clearInterval(this.timerID);
    }

    tick() {
        this.setState({
        date: new Date()
    });

    }

    render() {
        return (
        <div>
         <h3>{this.state.date.toLocaleTimeString()}</h3>
        </div>
      );
    }
}