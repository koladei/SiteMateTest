import './App.css'
import { Button, ButtonGroup, Container, Form, FormGroup, Label, Modal, ModalBody, ModalFooter, Row, Spinner, Table } from 'reactstrap'
import { Route, Routes } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useServerAPI } from './hooks/useServerAPI';
import { Issue } from './types/Issue';
import Logo from "./assets/logo.png"

function App() {



  const Loading = () => {
    return <Modal isOpen={true} centered contentClassName='bg-transparent border-0'>
      <ModalBody className='d-flex'>
        <Spinner />
        <h3 className='d-block mx-4'>Loading ...</h3>
      </ModalBody>
    </Modal>
  }

  const HomePage = () => {
    const [showAddModal, setShowAddModal] = useState(false);
    const [form, setForm] = useState<Partial<Issue>>({ title: "", description: "" });
    const loading = useServerAPI(state => state.loading);
    const { issues, getIssues, deleteIssue, createIssue, updateIssue } = useServerAPI(state => ({ loading: state.loading, issues: state.issues.sort((a, b) => (a.createdAt || 0).valueOf() - (b.createdAt || 0).valueOf()), getIssues: state.getIssues, deleteIssue: state.deleteIssue, createIssue: state.createIssue, updateIssue: state.updateIssue }));

    // get issues for the first time
    useEffect(() => {
      getIssues();
    }, [getIssues]);

    console.log("loading", loading, useServerAPI(state => state));

    return <Container fluid className='w-100 text-start'>
      <div className='d-flex flex-row align-items-center '>
        <img src={Logo} alt="" style={{ height: 80 }} className='img' />
        <h1 className="my-5">| Issue Management Portal</h1>
      </div>
      <hr className='mb-5' />
      {loading && <Loading />}
      <ButtonGroup size='sm'>
        <Button onClick={() => setShowAddModal(true)}>Add</Button>
        <Button onClick={() => getIssues(true)}>Refresh</Button>
      </ButtonGroup>
      <hr />
      <Table striped className='text-start'>
        <thead>
          <tr>
            <th className='text-start'>#</th>
            <th className='text-start col-3'>Title</th>
            <th className='text-start col-7'>Description</th>
            <th className='text-start'></th>
          </tr>
        </thead>
        <tbody>
          {
            issues?.map((issue, i) => <tr key={`${issue.id}-${i}`}>
              <td className='text-start'>{i}</td>
              <td className='text-start'>{issue.title}</td>
              <td className='text-start'>{issue.description}</td>
              <td className='text-start text-end'>
                <ButtonGroup size='sm'>
                  <Button size='sm' onClick={() => deleteIssue(issue.id)}>Delete</Button>
                  <Button size='sm' color='primary' onClick={() => {
                    setForm(issue);
                    setShowAddModal(true);
                  }}>Edit</Button>
                </ButtonGroup>
              </td>
            </tr>)
          }
        </tbody>
      </Table>

      <ButtonGroup size='sm'>
        <Button onClick={() => setShowAddModal(true)}>Add</Button>
        <Button onClick={() => getIssues(true)}>Refresh</Button>
      </ButtonGroup>

      <Modal isOpen={showAddModal} toggle={() => setShowAddModal(false)} centered>
        <ModalBody>
          <Form>
            <FormGroup>
              <Label>Title</Label>
              <input type="text" value={form.title} className='form-control' placeholder='Provide a suitable title' onChange={({ currentTarget: { value: title } }) => setForm((prv) => ({ ...prv, title }))} />
            </FormGroup>
            <FormGroup>
              <Label>Description</Label>
              <textarea className='form-control' value={form.description} placeholder='Describe the issue' onChange={({ currentTarget: { value: description } }) => setForm((prv) => ({ ...prv, description }))}></textarea>
            </FormGroup>
          </Form>
        </ModalBody>
        <ModalFooter>
          <Button disabled={!(form.title?.length || 0 > 1) || !(form.description?.length || 0 > 1)} onClick={async () => {
            if (!form.id) {
              await createIssue(form);
              setShowAddModal(false);
            }
            else {
              await updateIssue(form.id, form);
              setForm({ title: "", description: "" });
              setShowAddModal(false);
            }
          }}>{form.id ? "Update" : "Add"}</Button>
        </ModalFooter>
      </Modal>
    </Container >

  }


  return <Routes>
    <Route path='/' element={<HomePage />} />
  </Routes>;
}

export default App
