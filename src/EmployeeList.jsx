import React from 'react'
import { Badge, Button, Modal } from 'react-bootstrap'
import EmployeeFilter from './EmployeeFilter.jsx'
import EmployeeAdd from './EmployeeAdd.jsx'

class EmployeeRow extends React.Component {
	constructor() {
		super()
		this.state = {
			modalVisible: false,
		}
		this.onDeleteClick = this.onDeleteClick.bind(this)
		this.handleToggleModal = this.handleToggleModal.bind(this)
	}
	handleToggleModal() {
		this.setState({ modalVisible: !this.state.modalVisible })
	}
	onDeleteClick() {
		this.props.deleteEmployee(this.props.employee._id)
		this.handleToggleModal()
	}
	render() {
		return (
			<tr>
				{/* <td><Link to={`/edit/${props.employee._id}`}></Link></td> */}
				<td>{this.props.employee.name}</td>
				<td>{this.props.employee.extension}</td>
				<td>{this.props.employee.email}</td>
				<td>{this.props.employee.title}</td>
				<td>{this.props.employee.dateHired.toDateString()}</td>
				<td>{this.props.employee.isEmployed ? 'Yes' : 'No'}</td>
				<td>
					<Button variant='danger' size='sm' onClick={this.handleToggleModal}>X</Button>
					<Modal show={this.state.modalVisible} onHide={this.handleToggleModal}>
						<Modal.Header closeButton><h1>Confirm Deletion</h1></Modal.Header>
						<Modal.Body><p>Are you sure you would like to delete the employee {this.props.employee._id}?</p></Modal.Body>
						<Modal.Footer><Button variant='danger' size='sm'
							onClick={this.onDeleteClick}>Confirm</Button></Modal.Footer>
					</Modal>
				</td>
			</tr>
		)
	}
}

function EmployeeTable(props) {
	const employeeRows = props.employees.map(employee =>
		<EmployeeRow key={employee._id} employee={employee} deleteEmployee={props.deleteEmployee} />
	)
	return (
		<table className="bordered-table">
			<thead>
				<tr>
					<th>Name</th>
					<th>Extension</th>
					<th>Email</th>
					<th>Title</th>
					<th>Date Hired</th>
					<th>Currently Employed?</th>
					<th></th>
				</tr>
			</thead>
			<tbody>
				{employeeRows}
			</tbody>
		</table>
	)
}

export default class EmployeeList extends React.Component {
	constructor() {
		super()
		this.state = { employees: [] }
		this.createEmployee = this.createEmployee.bind(this)
		this.deleteEmployee = this.deleteEmployee.bind(this)
	}
	componentDidMount() {
		this.loadData()
	}
	loadData() {
		fetch('/api/employees')
			.then(response => response.json())
			.then(data => {
				console.log('Total count of records:', data.count)
				data.employees.forEach(employee => {
					employee.dateHired = new Date(employee.dateHired)
					employee.isEmployed = employee.isEmployed ? 'Yes' : 'No'
				})
				this.setState({ employees: data.employees })
			})
			.catch(err => { console.log(err) }
			)
	}
	deleteEmployee(id) {
		fetch(`/api/employees/${id}`, { method: 'DELETE' })
			.then(response => {
				if (!response.ok)
					alert('Failed to delete issue')
				else
					this.loadData()
			})
	}
	createEmployee(employee) {
		fetch('/api/employees', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(employee),
		})
			.then(response => response.json())
			.then(newEmployee => {
				newEmployee.employee.dateHired = new Date(newEmployee.employee.dateHired)
				newEmployee.employee.isEmployed = newEmployee.employee.isEmployed ? 'Yes' : 'No'
				const newEmployees = this.state.employees.concat(newEmployee.employee)
				this.setState({ employees: newEmployees })
				console.log('Total count of records:', newEmployees.length)
			})
			.catch(err => { console.log(err) })
	}
	render() {
		return (
			<React.Fragment>
				<h1><Badge bg="secondary">Employee Management Application</Badge></h1>
				<EmployeeAdd createEmployee={this.createEmployee} />
				<EmployeeFilter />
				<hr />
				<EmployeeTable employees={this.state.employees} deleteEmployee={this.deleteEmployee} />
				<hr />
			</React.Fragment>
		)
	}
}