import Navigation from '../../components/Navigation'
import ProsumerUserInfo from "../../components/prosumer/ProsumerUserInfo";


function ProsumerUser() {
    return (
      <div className="ProsumerUser">
        <Navigation type="prosumer"/>
        <ProsumerUserInfo/>
      </div>
    );
}

export default ProsumerUser;