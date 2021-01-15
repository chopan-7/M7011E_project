import Navigation from '../../components/Navigation'
import ProsumerUpload from "../../components/prosumer/ProsumerUpload";


function ProsumerOptions() {
    return (
      <div className="ProsumerOptions">
        <Navigation type="prosumer"/>
        <h3>ProsumerOptions</h3>
        <ProsumerUpload/>
      </div>
    );
}

export default ProsumerOptions;