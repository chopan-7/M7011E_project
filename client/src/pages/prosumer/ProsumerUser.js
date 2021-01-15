import Navigation from '../../components/Navigation'
import ProsumerUserInfo from "../../components/prosumer/ProsumerUserInfo";
import ProsumerUpload from "../../components/prosumer/ProsumerUpload";


function ProsumerUser() {
    return (
      <div className="ProsumerUser">
        <Navigation type="prosumer"/>
        <ProsumerUpload/>
        <ProsumerUserInfo/>
      </div>
    );
}

export default ProsumerUser;