import './App.css'
import { Button, ButtonGroup, Container, Form, FormGroup, Label, Modal, ModalBody, ModalFooter, Table } from 'reactstrap'
import { Route, Routes } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useServerAPI } from './hooks/useServerAPI';
import { Issue } from './types/Issue';

function App() {

  const { issues, getIssues, deleteIssue, createIssue, updateIssue } = useServerAPI(state => ({ issues: state.issues.sort((a, b) => a.id.toLocaleString().localeCompare(b.id.toLocaleString())), getIssues: state.getIssues, deleteIssue: state.deleteIssue, createIssue: state.createIssue, updateIssue: state.updateIssue }));

  // get issues for the first time
  useEffect(() => {
    getIssues();
  }, [getIssues]);

  const HomePage = () => {
    const [showAddModal, setShowAddModal] = useState(false);
    const [form, setForm] = useState<Partial<Issue>>({ title: "", description: "" });

    return <Container fluid className='w-100 text-start'>
      <Table striped className='text-start'>
        <tr>
          <th className='text-start'>#</th>
          <th className='text-start'>Title</th>
          <th className='text-start'>Description</th>
          <th className='text-start'>Actions</th>
        </tr>

        {
          issues?.map((issue, i) => <tr key={`${issue.id}-${i}`}>
            <td className='text-start'>{i}</td>
            <td className='text-start'>{issue.title}</td>
            <td className='text-start'>{issue.description}</td>
            <td className='text-start'>
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
      </Table>

      <FormGroup>
        <Button onClick={() => setShowAddModal(true)}>Add</Button>
      </FormGroup>

      <Modal isOpen={showAddModal}>
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
            if (!form.id)
              await createIssue(form);
            else
              await updateIssue(form.id, form);
            setForm({ title: "", description: "" })
          }}>{form.id ? "Update" : "Add"}</Button>
        </ModalFooter>
      </Modal>
    </Container>
  }

  return <Routes>
    <Route path='/' element={<HomePage />} />
  </Routes>;
}

export default App
