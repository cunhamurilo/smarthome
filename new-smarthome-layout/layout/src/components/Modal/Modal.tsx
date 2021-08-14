// import { FormEvent } from 'react';
import Modal from 'react-modal';
import "./styles.scss";

type ModalProps = {
  open: boolean;
  title: string;
  fields: Array<{ type:string, value:string}>;
  item: string;
  type: string;
  value: string;
  closeModal: ()=> void;
};

export function ModalComponent({ open = false, title, fields, item, type, value, closeModal, ...props }: ModalProps) {

  function handleModalButton(event: any) {
    event.preventDefault()
    switch (item) {
      case "device":
        break
      case "city":
        let cities = localStorage.getItem("cities")
        let sub_menu = [] as string[]
        let new_actual = ""
        let json = JSON.parse(cities || "")
        let aux = [] as string[]
        sub_menu = json.cities

        // sub_menu.push(event.currentTarget)

        aux = sub_menu.filter((element) => value !== "Add new city" && value !== "Remove city" &&  element !== value)
        if(type === 'remove'){
          aux = aux.filter((element) => element !== value)
          new_actual = aux.length === 0 ? "No city":aux[0]
        }

        aux = aux.map(value => {
          return `"${value}"`
        })

        let testObject = `{ "actual": "${new_actual}", "cities":[${aux}] }`;
        console.log(testObject)
        localStorage.setItem('cities', testObject);
        break
    }
    console.log(event.currentTarget.rename, type, item, value)
  }

  function handleTextButton(){
    switch (type) {
      case "config":
        return "UPDATE"
      case "remove":
        return "REMOVE"
      default:
        return 'NEXT'
    }
  }

  return (
    <Modal
    isOpen={open}
    contentLabel="Example Modal"
    onRequestClose={closeModal}
    ariaHideApp={false}
    style={{
      content: {
        maxWidth: '500px',
        margin: 'auto',
        marginTop: '30vh',
        paddingLeft: '0px',
        paddingRight: '0px',
        bottom: 'auto',
        borderRadius: '12px',
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'column',
      },
      overlay: {
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        zIndex: 1,
      }
    }}
  >
    <div className='modal-title'>{title}</div>
    <div className="separator" key="1"></div>
    <div className='modal-content'>
      <form id="modalForm" onSubmit={handleModalButton}>
      {
        fields.map((element, index) => {
          return (
            <div key={index}>
              { element.type === 'input' && 
                <div className="form__group field" key={index}>
                  <input type="input" className="form__field" placeholder="Name" name={element.value} id={element.value} required />
                  <label htmlFor={element.value} className="form__label">{element.value}</label>
                </div>
              }
            </div>
          )
        })
      }
      </form>
    </div>
    {fields.length > 0 &&
      <div className="separator" key="2"></div>
    }
    <button className='modal-button' type="submit" form="modalForm" >
      {handleTextButton()}
    </button>
  </Modal>
  )
}