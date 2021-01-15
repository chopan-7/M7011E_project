import ProsumerUserInfo from "../../components/prosumer/ProsumerUserInfo";
import ProsumerUpload from "../../components/prosumer/ProsumerUpload";


function ProsumerUser() {
    return (
      <div className="ProsumerUser">
        <ProsumerUpload/>
        <ProsumerUserInfo/>
        
      </div>
    );
}

export default ProsumerUser;