import './App.css'
import { Button, Container, Form, FormGroup, Input, Modal, ModalBody, ModalFooter, Table } from 'reactstrap'
import { Route, Routes } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useServerAPI } from './hooks/useServerAPI';

function App() {

  const { issues, getIssues } = useServerAPI(state => ({ issues: state.issues, getIssues: state.getIssues }));

  // get issues for the first time
  useEffect(() => {
    getIssues();
  }, [getIssues]);


  // const issues: Issue[] = [];

  const HomePage = () => {
    const [showAddModal, setShowAddModal] = useState(false)
    return <div className='table-responsive w-100'>
      <table className='table w-100'>
        <tr>
          <th>ID</th>
          <th>Title</th>
          <th>Description</th>
          <th>Actions</th>
        </tr>

        {
          issues?.map((issue, i) => <tr key={`${issue.id}-${i}`}>
            <td>{i}</td>
            <td>{issue.title}</td>
            <td>{issue.description}</td>
            <td><Button>Delete</Button></td>
          </tr>)
        }
      </table>

      <FormGroup>
        <Button onClick={() => setShowAddModal(true)}>Add</Button>
      </FormGroup>

      <Modal isOpen={showAddModal}>
        <ModalBody>
          <Form>
            <FormGroup>
              <Input type="text" placeholder='Title'></Input>
            </FormGroup>
            <FormGroup>
              <Input type="textarea" placeholder='Description'></Input>
            </FormGroup>
          </Form>
        </ModalBody>
        <ModalFooter>
          <Button onClick={() => { }}>Add</Button>
        </ModalFooter>
      </Modal>
    </div>
  }

  return <Routes>
    <Route path='/' element={<HomePage />} />
  </Routes>;
}

export default App
