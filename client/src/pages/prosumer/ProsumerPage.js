//import ProsumerOverview from "../../components/prosumer/ProsumerOverview";
import ProsumerOverview from "../../components/prosumer/ProsumerOverview";
import ProsumerControll from "../../components/prosumer/ProsumerControll";
import "./Prosumer.css"



function ProsumerPage() {
    return (
      <div className="ProsumerPage">
        <ProsumerOverview/>
        <ProsumerControll/>

        
      </div>
    );
}

export default ProsumerPage;