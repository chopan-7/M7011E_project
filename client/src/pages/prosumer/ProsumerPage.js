//import ProsumerOverview from "../../components/prosumer/ProsumerOverview";
import Navigation from '../../components/Navigation'
import ProsumerOverview from "../../components/prosumer/ProsumerOverview";
import ProsumerControll from "../../components/prosumer/ProsumerControll";
import "./Prosumer.css"



function ProsumerPage() {
    return (
      <div className="ProsumerPage">
        <Navigation type="prosumer"/>
        <ProsumerOverview/>
        <ProsumerControll/>
      </div>
    );
}

export default ProsumerPage;