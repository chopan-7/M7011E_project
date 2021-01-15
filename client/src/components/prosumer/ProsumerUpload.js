import { resolve } from 'bluebird'
import React, {useState} from 'react'


function ProsumerUpload() {

    const [picture, setPicture] = useState("")

    const uploadPicture = async e =>{
        const file = e.target.files[0]
        const base64 = await convertBase64(file)
        
        setPicture(base64)

    }

    const convertBase64 = (file) => {
        return new Promise((resolve, reject) =>{
            const readFile = new FileReader()
            readFile.readAsDataURL(file)

            readFile.onload = () => {
                resolve(readFile.result)
            }

            readFile.onerror = (error) => {
                reject(error)
            }

        })
    }
        
    
    return (
      <div className="ProsumerUpload">
          <input
          type="file"
          name="MyPicture"
          accept="image/*"
          onChange={uploadPicture}
          />
          <br></br>
          <img src={picture}
          height = "250px" />      
      </div>
      
    );
}

export default ProsumerUpload