//import ProsumerOverview from "../../components/prosumer/ProsumerOverview";
import ProsumerOverview from "../../components/prosumer/ProsumerOverview";
import ProsumerControll from "../../components/prosumer/ProsumerControll";




function ProsumerPage() {
    return (
      <div className="ProsumerPage">
        <ProsumerOverview/>
        <ProsumerControll/>

        
      </div>
    );
}

export default ProsumerPage;