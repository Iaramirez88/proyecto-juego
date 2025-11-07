/*
import { useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import spider from "../../assets/images/armar/arannaModArmar.svg";
import pieze1 from "../../assets/images/armar/aranna1.svg";
import pieze2 from "../../assets/images/armar/aranna2.svg";
import pieze3 from "../../assets/images/armar/aranna3.svg";
import pieze4 from "../../assets/images/armar/aranna4.svg";
import pieze5 from "../../assets/images/armar/aranna5.svg";
import pieze6 from "../../assets/images/armar/aranna6.svg";
import pieze7 from "../../assets/images/armar/aranna7.svg";
import pieze8 from "../../assets/images/armar/aranna8.svg";
import pieze9 from "../../assets/images/armar/aranna9.svg";
import "../../assets/styles/games.css";*/

/*const Objetos = [
   {
      id: '1',
      Image: pieze1
   },
   {
      id: '2',
      Image: pieze2
   },
   {
      id: '3',
      Image: pieze3
   },
   {
      id: '4',
      Image: pieze4
   },
   {
      id: '5',
      Image: pieze5
   },
   {
      id: '6',
      Image: pieze6
   },
   {
      id: '7',
      Image: pieze7
   },
   {
      id: '8',
      Image: pieze8
   },
   {
      id: '9',
      Image: pieze9
   },

];

const Colum =[
   {
   [piesas]:{
      name: 'piesas',
      items: [Objetos]
   }

   },
];
const reorder = (list, startIndex, endIndex) =>{
   const result= [...list];
   const [removed] = result.splice(startIndex, 1);
   result.splice(endIndex,0,removed);

   return result;
};

function Armar() {
   const [colum,setCulum] = useState(Colum);
   return (
      <DragDropContext onDragEnd={(result) }>
         {Object.entries(colum).map(([id, colum])=>{
            return(
               <Droppable droppableId={id}>
               history.push("/level-up", { gameUrl: `/armar/${id}` });
                     return(
                        <div {...providad.droppableProps} ref={providad.innerRef}>
                        {colum.items.map((items, index) => {
                           return(
                         <Draggable key={items.id} draggableId>

                         </Draggable>     
                           );
                        })}
                        </div>
                     );
                  }}
               </Droppable>
            );
            })}
      </DragDropContext>

   );
}

export default Armar;*/