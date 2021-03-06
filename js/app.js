// es5, 6, and 7 polyfills, powered by babel
import polyfill from "babel-polyfill"

//
// fetch method, returns es6 promises
// if you uncomment 'universal-utils' below, you can comment out this line
import fetch from "isomorphic-fetch"

import $ from "jquery"
import _ from "underscore"
import Backbone from "bbfire"


import DOM from 'react-dom'
import React, {Component} from 'react'

function app() {
    // start app
    // new Router()

    var ItemModel = Backbone.Model.extend({

    	defaults: {
    		done: false,
            dueDate: "",
            descript: ""
    	},

    	initialize: function(taskName) {
    		this.set({task: taskName})
    	}
    })

    var ToDoCollection = Backbone.Collection.extend({
    	model: ItemModel
    })

    var ToDoView = React.createClass({

    	_addItem: function(taskName) {
            // var mod = new ItemModel({task: taskName}) 
    		
    		this.state.all.add(new ItemModel(taskName))
    		this._updater()
    	},

    	_updater: function(){
    		this.setState({
    			all: this.state.all,
    			done: this.state.all.where({done:true}),
    			undone: this.state.all.where({done: false}),
    			showing: location.hash.substr(1)
    		})
    	},

    	getInitialState: function() {
    		return {
    			all: this.props.toDoColl,
    			done: this.props.toDoColl.where({
    				done: true}),
    			undone: this.props.toDoColl.where({done: false}),
    			showing: this.props.showing
    		}
    	},

    	render: function() {
    		var coll = this.state.all
    		if (this.state.showing === "done") coll = this.state.done
    		if (this.state.showing === "undone") coll = this.state.undone
    		
    		return (
    			<div className="toDoView">
	    			<Tabs updater={this._updater}
	    				showing={this.state.showing} />
	    			<ItemAdder adderFunc={this._addItem}/>
	    			<ToDoList updater={this._updater}
	    				toDoColl={coll}/>
    			</div>		
    		)	
    	}		
    })

    var Tabs = React.createClass({
    	_genTab: function(tabType, i) {
    		return <Tab updater={this.props.updater}
    		key={i} type={tabType} showing={this.props.showing} />
    	},
    	
    	render: function() {
    		return (
    			<div className="tabs">
    			{["all", "done", "undone"].map(this._genTab)}
    			</div>
    		)
    	}	
    })

    var Tab = React.createClass({
    	_changeRoute: function() {
    		location.hash = this.props.type
    		this.props.updater()
    	},

    	render: function() {
    		var styleObj = {}
    		if (this.props.type === this.props.showing){
    				styleObj.background = "orange"
    		}

    		return (
    			<div onClick={this._changeRoute}
    			style={styleObj} className="tab">
    			<p>{this.props.type}</p>
    		</div>	
    		)	
    	}
    })

    var ItemAdder = React.createClass({

    	_handleKeyDown: function(keyEvent) {
            if(keyEvent.keyCode === 13) {
                var newToDoItem = keyEvent.target.value
                this.props.adderFunc(newToDoItem)
                keyEvent.target.value = ""
            }   
    	},

    	render: function() {
    		return <input onKeyDown={this._handleKeyDown} className="toDoAdder" type="text" placeholder="whatca gotta do?" id="toDo"/>
    	}
    })
    
    var ToDoList = React.createClass({

    	_makeItem: function(model,i) {
    		console.log(model, i)
    		return <Item key={i} updater={this.props.updater} itemModel={model} />
    	},
    	
    	render: function() {
    		return (
    			<div className="toDoList">
    				{this.props.toDoColl.map(this._makeItem)}
    			</div>	
    		)
    	}	
    })

    var Item = React.createClass({
    	_toggleDone: function() {
    		if (this.props.itemModel.get('done')) {
    			this.props.itemModel.set({done: false})
    		}
    		else {
    			this.props.itemModel.set({done: true}
    			)
    		}	
    		this.props.updater()
    	},

        _handleDescription: function(keyEvent) {
            if(keyEvent.keyCode === 13) {
                var newDesc = keyEvent.target.value
                this.props.itemModel.set({descript: newDesc})
                console.log(this.props.itemModel)
                keyEvent.target.value = ""
            }   
        },

        _handleDueDate: function(keyEvent) {
            if(keyEvent.keyCode === 13) {
                var newDueDate = keyEvent.target.value
                this.props.itemModel.set({dueDate: newDueDate})
                console.log(this.props.itemModel)
                keyEvent.target.value = ""
            }   
        },

    	render: function() {
    		var buttonFiller = this.props.itemModel.
    		get('done') ? "\u2713" : ' '

    		return (
    			<div className="toDoItem">
    				{this.props.itemModel.get('task')}
                    <input onKeyDown={this._handleDescription} className="descAdder" type="text" placeholder="description..." id="desc"/>
                    <input onKeyDown={this._handleDueDate} className="dueDateAdder" type="text" placeholder="Due when?" id="dueDate"/>
    			<button onClick={this._toggleDone}>{buttonFiller}</button>
    			</div>	
    		)
    	}
    })

    var ToDoRouter = Backbone.Router.extend({
    	routes: {
    		"undone": "showUndone",
    		"done" : "showDone",
    		"*default" : "home"
    	},

    	showDone: function(){
    	DOM.render(<ToDoView showing="done" toDoColl={new ToDoCollection()}/>, document.querySelector('.container'))	
    	},

    	home: function(){
    	DOM.render(<ToDoView showing="all" toDoColl={new ToDoCollection()}/>, document.querySelector('.container'))
    	},

    	showUnDone: function(){
    	DOM.render(<ToDoView showing="undone" toDoColl={new ToDoCollection()}/>, document.querySelector('.container'))
    	},

    	initialize: function() {
    		Backbone.history.start()
    	}
    })

    var pr = new ToDoRouter()
    
}

app()
