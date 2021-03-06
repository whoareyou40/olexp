
/**
 * @namespace olexp.manager
 */
olexp.manager = olexp.manager || {};

//==================================================
// Manager
//--------------------------------------------------
(function(olexp) {

    /**
     * Item manager that synchronizes adding and removing items from the map
     * sidebar and the corresponding layers on the ol3 map
     * @class
     * @memberOf olexp.manager
     * @param {external:ol.Map} map Managed map
     * @param {external:jQuery.fn.w2sidebar} outline Managed outline sidebar
     * @param {external:jQuery.fn.w2grid} details Details grid
     * @param {string} layersId w2ui name of layers node
     * @param {string} overlaysId w2ui name of overlays node
     * @private
     */
    var ManagerAPI = function(map, outline, details, layersId, overlaysId)
    {

        /**
         * Total count of items added
         * @ignore
         * @type {number}
         */
        this.count = 0;

        /**
         * Details grid
         * @ignore
         * @type {external:jQuery.fn.w2grid}
         */
        this.details = details;

        /**
         * Event listeners
         * @ignore
         * @type {olexp.event.Event}
         */
        this.event = new olexp.event.Event({'select:item' : []});

        /**
         * List of managed items
         * @ignore
         * @type {number}
         */
        this.items = [];

        /**
         * Layer Manager
         * @ignore
         * @type {olexp.manager.NodeManager}
         */
        this.managerLayers = new olexp.manager.NodeManager(layersId, 
                                                           map.getLayers(),
                                                           outline,
                                                           details);

        /**
         * Layers node id prefix
         * @ignore
         * @type {string}
         */
        this.layersId = layersId;

        /**
         * Overlay Manager
         * @ignore
         * @type {olexp.manager.NodeManager}
         */
        this.managerOverlays = new olexp.manager.NodeManager(overlaysId,
                                                             map.getOverlays(),
                                                             outline,
                                                             details);

        /**
         * Managed map
         * @ignore
         * @type {ol.Map}
         */
        this.map = map;
        this.map.on('change:layergroup', this.onLayerGroupChanged, this);

        /**
         * Managed outline sidebar
         * @ignore
         * @type {external:jQuery.fn.w2sidebar}
         */
        this.outline = outline;

        /**
         * Overlays node id prefix
         * @ignore
         * @type {string}
         */
        this.overlaysId = overlaysId;

    };

    /**
     * Check if id is a Layer node
     * @ignore
     * @memberOf olexp.manager.ManagerAPI.prototype
     * @param {string} id Item ID
     * @private
     * @returns True if id a Layer node otherwise false
     */
    ManagerAPI.prototype.isIdLayerNode = function(id)
    {
        if (typeof id !== 'string') return false;
        return id.indexOf(this.layersId) === 0;
    };

    /**
     * Check if id is a Overlay node
     * @ignore
     * @memberOf olexp.manager.ManagerAPI.prototype
     * @param {string} id Item ID
     * @private
     * @returns True if id is a Overlay node otherwise false
     */
    ManagerAPI.prototype.isIdOverlayNode = function(id)
    {
        if (typeof id !== 'string') return false;
        return id.indexOf(this.overlaysId) === 0;
    };

    /**
     * Check if item is selected
     * @function isSelected
     * @memberOf olexp.manager.ManagerAPI.prototype
     * @param {string} id Item ID
     * @public
     * @returns True if item is selected otherwise false
     */
    ManagerAPI.prototype.isSelected = function(id)
    {
        return id === this.outline.selected;
    };

    /**
     * Get item based on id
     * @function getById
     * @memberOf olexp.manager.ManagerAPI.prototype
     * @param {string} id Item ID
     * @public
     * @returns {null|olexp.item.Item} Managed item or null if not found
     */
    ManagerAPI.prototype.getById = function(id)
    {

        // Check if this is a layer node
        if (this.isIdLayerNode(id))
        {
            return this.managerLayers.getById(id);
        }
        // Check if this is a overlay node
        else if (this.isIdOverlayNode(id))
        {
            return this.managerOverlays.getById(id);
        }

        return null;

    };

    /**
     * Get layer details
     * @function getDetails
     * @memberOf olexp.manager.ManagerAPI.prototype
     * @param {string} id Layer ID
     * @public
     * @returns {array} Item details
     */
    ManagerAPI.prototype.getDetails = function(id)
    {

        // Check if this is a layer node
        if (this.isIdLayerNode(id))
        {
            var itemLayer = this.managerLayers.getById(id);
            if (itemLayer !== null) return itemLayer.getDetails();
        }
        // Check if this is a overlay node
        else if (this.isIdOverlayNode(id))
        {
            var itemOverlay = this.managerOverlays.getById(id);
            if (itemOverlay !== null) return itemOverlay.getDetails();
        }

        return [];

    };

    /**
     * Get node for item
     * @function getNode
     * @memberOf olexp.manager.ManagerAPI.prototype
     * @param {string} id Item ID
     * @public
     * @returns {external:jQuery.fn.w2sidebar.nodes} w2ui sidebar node
     */
    ManagerAPI.prototype.getNode = function(id)
    {
        return this.outline.get(id);
    };

    /**
     * Move item down in map list
     * @function moveDown
     * @memberOf olexp.manager.ManagerAPI.prototype
     * @param {string} id Item ID
     * @public
     * @returns {boolean} True if moved otherwise false
     */
    ManagerAPI.prototype.moveDown = function(id)
    {

        // If no id provided use selected
        if (typeof id === 'undefined') id = this.outline.selected;

        // Check if this is a layer node
        if (this.isIdLayerNode(id))
        {
            return this.managerLayers.moveDown(id);            
        }
        // Check if this is a overlay node
        else if (this.isIdOverlayNode(id))
        {
            return this.managerOverlays.moveDown(id);
        }

        return false;

    };

    /**
     * Move item up in map list
     * @function moveUp
     * @memberOf olexp.manager.ManagerAPI.prototype
     * @param {string} id Item ID
     * @public
     * @returns {boolean} True if moved otherwise false
     */
    ManagerAPI.prototype.moveUp = function(id)
    {

        // If no id provided use selected
        if (typeof id === 'undefined') id = this.outline.selected;

        // Check if this is a layer node
        if (this.isIdLayerNode(id))
        {
            return this.managerLayers.moveUp(id);
        }
        // Check if this is a overlay node
        else if (this.isIdOverlayNode(id))
        {
            return this.managerOverlays.moveUp(id);
        }

        return false;

    };

    /**
     * Remove listener
     * @function off
     * @memberOf olexp.manager.ManagerAPI.prototype
     * @param {string} type The event type.
     * @param {function} listener The listener function.
     * @param {object} opt_this The object to use as this in listener.
     * @public
     */
    ManagerAPI.prototype.off = function(type, listener, opt_this)
    {
        this.event.off(type, listener, opt_this);
        this.managerLayers.off(type, listener, opt_this);
        this.managerOverlays.off(type, listener, opt_this);
    };

    /**
     * Add listener
     * @function on
     * @memberOf olexp.manager.ManagerAPI.prototype
     * @param {string} type The event type.
     * @param {function} listener The listener function.
     * @param {object} opt_this The object to use as this in listener.
     * @public
     */
    ManagerAPI.prototype.on = function(type, listener, opt_this)
    {
        this.event.on(type, listener, opt_this);
        this.managerLayers.on(type, listener, opt_this);
        this.managerOverlays.on(type, listener, opt_this);
    };

    /**
     * Callback when node is selected either by click or double click
     * @function onItemSelected
     * @memberOf olexp.manager.ManagerAPI.prototype
     * @param {string} id Layer ID
     * @public
     */
    ManagerAPI.prototype.onItemSelected = function(id)
    {
        this.event.trigger('select:item', id);
    };

    /**
     * Callback when map layer group is changed
     * @function onLayerGroupChanged
     * @memberOf olexp.manager.ManagerAPI.prototype
     * @param {external:ol.ObjectEvent} event The change event.
     * @private
     */
    ManagerAPI.prototype.onLayerGroupChanged = function(event)
    {

        this.managerLayers.setLayers(event.target.getLayers());

    };

    /**
     * Remove item from map
     * @function removeFromMap
     * @memberOf olexp.manager.ManagerAPI.prototype
     * @param {olexp.item.Item} item Item to remove from map
     * @public
     * @returns {null|external:ol.layer.Layer|external:ol.Overlay} Layer removed
     *          from map or null if not found
     */
    ManagerAPI.prototype.removeFromMap = function(item)
    {

        // If no id provided use selected
        if (!(item.hasOwnProperty('id'))) return null;

        // Check if this is a layer node
        if (this.isIdLayerNode(item.id))
        {
            return this.managerLayers.removeFromMap(item);
        }
        // Check if this is a overlay node
        else if (this.isIdOverlayNode(item.id))
        {
            return this.managerOverlays.removeFromMap(item);
        }

        return null;

    };

    /**
     * Toggle node enable and corresponding layer visibility
     * @function toggleNode
     * @memberOf olexp.manager.ManagerAPI.prototype
     * @param {string} id Item ID of node to toggle
     * @public
     */
    ManagerAPI.prototype.toggleNode = function(id)
    {

        if (typeof id !== 'string') return;

        // ==================================================
        // Toggle sidebar node enabled state
        // --------------------------------------------------
        var node = this.outline.get(id);
        var enable = node.disabled;
        if (enable)
        {
            this.outline.enable(id);
        }
        else
        {
            this.outline.disable(id);
        }

        // ==================================================
        // Toggle map layer visibility
        // --------------------------------------------------

        // Check if this is a layer node
        if (this.isIdLayerNode(id))
        {
            var itemLayer = this.managerLayers.getById(id);
            if (itemLayer !== null) itemLayer.layer.setVisible(enable);
        }
        // Check if this is a overlay node
        else if (this.isIdOverlayNode(id))
        {
            var itemOverlay = this.managerOverlays.getById(id);
            if (itemOverlay !== null)
            {
                // Overlays don't have visibility so we hide DOM element
                var properties = itemOverlay.layer.getProperties();
                if (properties.hasOwnProperty('element'))
                {
                    var dom = $(properties.element);
                    if (enable)
                    {
                        dom.show();
                    }
                    else
                    {
                        dom.hide();
                    }
                }
            }
        }

    };

    /**
     * Update item editable properties
     * @function updateItem
     * @memberOf olexp.manager.ManagerAPI.prototype
     * @param {string} id ID of item to edit
     * @param {object} properties Item properties to update
     * @public
     */
    ManagerAPI.prototype.updateItem = function(id, properties)
    {
        var item = this.getById(id);
        if (item !== null)
        {
            item.setProperties(properties);

            // Update node
            var node = this.outline.get(id);
            node.text = item.name();

            this.outline.refresh();
        }
    };

    /**
     * Zoom to given item on map
     * @function zoomTo
     * @memberOf olexp.manager.ManagerAPI.prototype
     * @param {string} id ID of item on which to zoom
     * @public
     */
    ManagerAPI.prototype.zoomTo = function(id)
    {
        var item = this.getById(id);
        item.zoomTo(this.map);
    };

    /**
     * Item manager that synchronizes adding and removing items from the map
     * sidebar and the corresponding layers on the ol3 map
     * @function
     * @memberOf olexp.manager
     * @param {external:ol.Map} map Managed map
     * @param {external:jQuery.fn.w2sidebar} outline Managed outline sidebar
     * @param {external:jQuery.fn.w2grid} details Details grid
     * @param {string} layers w2ui name of layers node
     * @param {string} overlays w2ui name of overlays node
     * @public
     * @returns {olexp.manager.ManagerAPI}
     */
    olexp.manager.Manager = function(map, outline, details, layers, overlays)
    {
        var manager = new ManagerAPI(map, outline, details, layers, overlays);
        return {
            getById        : manager.getById.bind(manager),
            getDetails     : manager.getDetails.bind(manager),
            getNode        : manager.getNode.bind(manager),
            isSelected     : manager.isSelected.bind(manager),
            moveDown       : manager.moveDown.bind(manager),
            moveUp         : manager.moveUp.bind(manager),
            off            : manager.off.bind(manager),
            on             : manager.on.bind(manager),
            onItemSelected : manager.onItemSelected.bind(manager),
            removeFromMap  : manager.removeFromMap.bind(manager),
            toggleNode     : manager.toggleNode.bind(manager),
            updateItem     : manager.updateItem.bind(manager),
            zoomTo         : manager.zoomTo.bind(manager)
        };
    };

    return olexp;

}(olexp || {}));

//==================================================
// Node Manager
//--------------------------------------------------
(function(olexp) {

    /**
     * Node manager that synchronizes adding and removing items
     * @param {string} id Node id
     * @param {external:ol.Collection} layers Managed map layers
     * @param {external:jQuery.fn.w2sidebar} outline Managed outline sidebar
     * @param {external:jQuery.fn.w2grid} details Details grid
     * @private
     */
    var NodeManager = function(id, layers, outline, details)
    {

        /**
         * Total count of items added
         * @type {number}
         */
        this.count = 0;

        /**
         * Details grid
         * @type {external:jQuery.fn.w2grid}
         */
        this.details = details;

        /**
         * Event listeners
         * @type {olexp.event.Event}
         */
        this.event = new olexp.event.Event({'remove:item' : []});

        /**
         * Node id
         * @type {string}
         */
        this.id = id;

        /**
         * List of managed items
         * @type {number}
         */
        this.items = [];

        /**
         * Managed map layers
         * @type {ol.Collection}
         */
        this.layers = layers;
        this.layers.on('change:length', this.onLayerChanged, this);

        /**
         * Node managers
         * @type {object}
         * @example {item.id: NodeManager}
         */
        this.managers = {};

        /**
         * Managed outline sidebar
         * @type {external:jQuery.fn.w2sidebar}
         */
        this.outline = outline;

    };

    /**
     * Add layer to node manager
     * @memberOf NodeManager.prototype
     * @param {ol.layer.Layer|ol.Overlay} layer ol3 layer/overlay to add
     * @private
     * @returns {olexp.item.Item} Managed item for added layer
     */
    NodeManager.prototype.addLayer = function(layer)
    {

        // ==================================================
        // Create managed item
        // --------------------------------------------------

        // Create item id, name, and properties
        this.count += 1;
        var id = this.id + '-' + this.count;
        var name = 'Item ' + this.count;
        var properties = layer.getProperties();
        if (properties.hasOwnProperty('name')) name = properties.name;

        // Store managed item
        var item = new olexp.item.Item(id, name, layer);
        this.items.push(item);

        // ==================================================
        // Create w2ui node for item
        // --------------------------------------------------
        var node = {
            id   : item.id,
            img  : item.icon,
            text : item.name()
        };

        // ==================================================
        // Add item to outline
        // --------------------------------------------------

        // Always prepend new node to top
        var nodes = this.outline.get(this.id).nodes;
        if (nodes.length === 0)
        {
            this.outline.add(this.id, [node]);
        }
        else
        {
            this.outline.insert(this.id, nodes[0].id, [node]);
        }

        // ==================================================
        // Check layer is group and create a sub-manager and add its
        // layers
        // --------------------------------------------------
        if (item.type === olexp.item.Type.GROUP)
        {

            var layers = layer.getLayers();
            var manager = new NodeManager(item.id,
                                          layers,
                                          this.outline,
                                          this.details);

            layers.forEach(function(childLayer)
            {
                manager.addLayer(childLayer);
            }, this);
            this.managers[item.id] = manager;
            this.outline.expand(item.id);

        }

        return item;

    };

    /**
     * Get item based on id
     * @memberOf NodeManager.prototype
     * @param {string} id Item ID
     * @param {boolean} recursive True for recursive search otherwise false
     * @private
     * @returns {null|olexp.item.Item} Managed item or null if not found
     */
    NodeManager.prototype.getById = function(id, recursive)
    {

        if (typeof recursive === 'undefined') recursive = true;

        var numItems = this.getSize();
        for (var i = 0; i < numItems; i++)
        {
            if (this.items[i].id === id) return this.items[i];
            if (this.items[i].type === olexp.item.Type.GROUP && recursive)
            {
                var item = this.managers[this.items[i].id].getById(id);
                if (item === null) continue;
                if (item.id === id) return item;
            }
        }
        return null;

    };

    /**
     * Get item based on layer reference
     * @memberOf NodeManager.prototype
     * @param {ol.layer.Layer|ol.Overlay} layer ol3 layer/overlay
     * @param {boolean} recursive True for recursive search otherwise false
     * @private
     * @returns {null|olexp.item.Item} Managed item or null if not found
     */
    NodeManager.prototype.getByLayer = function(layer, recursive)
    {

        if (typeof recursive === 'undefined') recursive = true;

        var numItems = this.getSize();
        for (var i = 0; i < numItems; i++)
        {
            if (this.items[i].layer === layer) return this.items[i];
            if (this.items[i].type === olexp.item.Type.GROUP && recursive)
            {
                var item = this.managers[this.items[i].id].getByLayer(layer);
                if (item === null) continue;
                if (item.layer === layer) return item;
            }
        }
        return null;
    };

    /**
     * Get size of manager list
     * @memberOf NodeManager.prototype
     * @private
     * @returns {number} Size
     */
    NodeManager.prototype.getSize = function()
    {
        return this.items.length;
    };

    /**
     * Check if item is selected
     * @memberOf NodeManager.prototype
     * @param {string} id Item ID
     * @private
     * @returns {boolean} True if item is selected otherwise false
     */
    NodeManager.prototype.isSelected = function(id)
    {
        return id === this.outline.selected;
    };


    /**
     * Check if layer should be hidden and not added to manager
     * @memberOf NodeManager.prototype
     * @param {ol.layer.Layer|ol.Overlay} layer Item ID
     * @private
     * @returns {boolean} True if item is hidden otherwise false
     */
    NodeManager.prototype.isHidden = function(layer)
    {
        if (layer instanceof olexp.measure.Overlay) return true;
        return false;
    };

    /**
     * Move item down in map list
     * @memberOf NodeManager.prototype
     * @param {string} id Item ID
     * @private
     * @returns {null|boolean} True if moved, false is not moved, null if not
     *                         found.
     */
    NodeManager.prototype.moveDown = function(id)
    {

        var item = this.getById(id, false);

        if (item !== null)
        {
            // Item found in this node
            var movedItem = this.moveLayerUp(this.layers, item.layer);
            if (movedItem) movedItem = this.moveItemDown(id);
            return movedItem;
        }

        // Check if item in child managers
        var numItems = this.getSize();
        for (var i = 0; i < numItems; i++)
        {
            if (this.items[i].type === olexp.item.Type.GROUP)
            {
                var movedChild = this.managers[this.items[i].id].moveDown(id);
                if (movedChild !== null) return movedChild;
            }
        }

        return null;

    };

    /**
     * Move item down
     * @memberOf NodeManager.prototype
     * @param {string} id Item ID
     * @private
     * @returns {boolean} True if moved otherwise false
     */
    NodeManager.prototype.moveItemDown = function(id)
    {
        // Get node to move
        var node = this.outline.get(id);
        if (node === null) return false;

        // Get index in list
        var nodes = this.outline.find(node.parent.id,
        {
            parent : node.parent
        });
        var index = this.outline.get(node.parent.id, id, true);
        if (index >= (nodes.length - 1)) return false;

        // Get node to swap
        var nextId = nodes[index + 1].id;
        var nextNode = nodes[index + 1];

        // Check that nodes are in same parent node
        if (node.parent !== nextNode.parent) return false;

        // Swap nodes
        this.outline.remove(nextId);
        this.outline.insert(node.parent, id, nextNode);
        this.outline.select(id);

        return true;
    };

    /**
     * Move item up
     * @memberOf NodeManager.prototype
     * @param {string} id Item ID
     * @private
     * @returns {boolean} True if moved otherwise false
     */
    NodeManager.prototype.moveItemUp = function(id)
    {
        // Get node to move
        var node = this.outline.get(id);
        if (node === null) return false;

        // Get index in list
        var nodes = this.outline.find(node.parent.id,
        {
            parent : node.parent
        });
        var index = this.outline.get(node.parent.id, id, true);
        if (index <= 0) return false;

        // Get node to swap
        var prevId = nodes[index - 1].id;
        var prevNode = nodes[index - 1];

        // Check that nodes are in same parent node
        if (node.parent !== prevNode.parent) return false;

        // Swap nodes
        this.outline.remove(id);
        this.outline.insert(node.parent, prevId, node);
        this.outline.select(id);

        return true;
    };

    /**
     * Move layer down
     * @memberOf NodeManager.prototype
     * @param {ol.Collection} layers Source layer list
     * @param {ol.layer.Layer|ol.Overlay} layer Layer to move
     * @private
     * @returns {boolean} True if moved otherwise false
     */
    NodeManager.prototype.moveLayerDown = function(layers, layer)
    {
        var index = olexp.util.indexOf(layers, layer);
        var numLayers = this.layers.getLength();
        if (index < numLayers - 1)
        {
            var item = this.getByLayer(layer, false);

            // Set item to moving so it's not removed by the manager
            item.moving(true);
            layers.removeAt(index);
            layers.insertAt(index + 1, layer);
            item.moving(false);

            return true;
        }
        return false;
    };

    /**
     * Move layer up
     * @memberOf NodeManager.prototype
     * @param {ol.Collection} layers Source layer list
     * @param {ol.layer.Layer|ol.Overlay} layer Layer to move
     * @private
     * @returns {boolean} True if moved otherwise false
     */
    NodeManager.prototype.moveLayerUp = function(layers, layer)
    {
        var index = olexp.util.indexOf(layers, layer);
        if (index > 0)
        {
            var item = this.getByLayer(layer, false);

            // Set item to moving so it's not removed by the manager
            item.moving(true);
            layers.removeAt(index);
            layers.insertAt(index - 1, layer);
            item.moving(false);

            return true;
        }
        return false;
    };

    /**
     * Move item up in map list
     * @memberOf NodeManager.prototype
     * @param {string} id Item ID
     * @private
     * @returns {null|boolean} True if moved, false if not moved, null if not
     *                         found
     */
    NodeManager.prototype.moveUp = function(id)
    {

        var item = this.getById(id, false);

        if (item !== null)
        {
            // Item found in this node
            var movedItem = this.moveLayerDown(this.layers, item.layer);
            if (movedItem) movedItem = this.moveItemUp(id);
            return movedItem;
        }

        // Check if item in child managers
        var numItems = this.getSize();
        for (var i = 0; i < numItems; i++)
        {
            if (this.items[i].type === olexp.item.Type.GROUP)
            {
                var movedChild = this.managers[this.items[i].id].moveUp(id);
                if (movedChild !== null) return movedChild;
            }
        }

        return null;

    };

    /**
     * Remove listener
     * @memberOf NodeManager.prototype
     * @param {string} type The event type.
     * @param {function} listener The listener function.
     * @param {object} opt_this The object to use as this in listener.
     * @private
     */
    NodeManager.prototype.off = function(type, listener, opt_this)
    {
        this.event.off(type, listener, opt_this);

        // Remove listener from child managers
        var numItems = this.getSize();
        for (var i = 0; i < numItems; i++)
        {
            if (this.items[i].type === olexp.item.Type.GROUP)
            {
                this.managers[this.items[i].id].off(type, listener, opt_this);
            }
        }

    };

    /**
     * Callback when layer changed
     * @memberOf NodeManager.prototype
     * @param {string} type The event type.
     * @param {function} listener The listener function.
     * @param {object} opt_this The object to use as this in listener.
     * @private
     */
    NodeManager.prototype.on = function(type, listener, opt_this)
    {
        this.event.on(type, listener, opt_this);

        // Register listener with child managers
        var numItems = this.getSize();
        for (var i = 0; i < numItems; i++)
        {
            if (this.items[i].type === olexp.item.Type.GROUP)
            {
                this.managers[this.items[i].id].on(type, listener, opt_this);
            }
        }

    };

    /**
     * Callback when layer removed
     * @memberOf NodeManager.prototype
     * @param {olexp.item.Item} item OpenLayers Explorer Item
     * @private
     */
    NodeManager.prototype.onItemRemoved = function(item)
    {
        // Trigger item remove event
        this.event.trigger('remove:item', item);

        // Remove item
        if (this.isSelected(item.id))
        {
            this.details.clear();
        }
        this.remove(item);
    };

    /**
     * Callback when layer changed
     * @memberOf NodeManager.prototype
     * @param {ol.ObjectEvent} event ol3 Layer change event
     * @private
     */
    NodeManager.prototype.onLayerChanged = function(event)
    {

        // ==================================================
        // Extract layers from change event
        // --------------------------------------------------
        var changes = event.target;

        // ==================================================
        // If layer is in map but not in manager then add
        // --------------------------------------------------
        var numLayers = changes.getLength();
        for (var i = 0; i < numLayers; i++)
        {
            var layer = changes.item(i);
            if (this.isHidden(layer)) continue;
            var itemMap = this.getByLayer(layer);
            if (itemMap === null)
            {
                this.addLayer(layer);
            }
        }

        // ==================================================
        // If layer is in manager but not in map then remove
        // --------------------------------------------------

        var items = this.toList();
        var numItems = items.length;
        for (var j = 0; j < numItems; j++)
        {
            var itemManager = items[j];

            // Check if item is just being moved by user
            if (itemManager.moving()) continue;

            var index = olexp.util.indexOf(this.layers, itemManager.layer);
            if (index === -1)
            {
                this.onItemRemoved(itemManager);
            }
        }

    };

    /**
     * Remove layer from manager
     * @memberOf NodeManager.prototype
     * @param {olexp.item.Item} item Managed item to remove
     * @private
     * @returns {boolean} True if removed otherwise false
     */
    NodeManager.prototype.remove = function(item)
    {

        // ==================================================
        // Remove layer from manager
        // --------------------------------------------------
        var index = this.items.indexOf(item);
        if (index !== -1)
        {
            this.items.splice(index, 1);
            this.outline.remove(item.id);
            return true;
        }

        // ==================================================
        // Check if item in child managers and remove
        // --------------------------------------------------
        var numItems = this.getSize();
        for (var i = 0; i < numItems; i++)
        {
            if (this.items[i].type === olexp.item.Type.GROUP)
            {
                var removed = this.managers[this.items[i].id].remove(id);
                if (removed) return true;
            }
        }

        return false;

    };

    /**
     * Remove item from map
     * @memberOf NodeManager.prototype
     * @private
     * @param {null|ol.layer.Layer|ol.Overlay} Layer removed from map or null
     *                                         if not found
     */
    NodeManager.prototype.removeFromMap = function(item)
    {
        var layerMap = this.layers.remove(item.layer);
        if (typeof layerMap !== 'undefined') return layerMap;

        // ==================================================
        // Check if item in child managers and remove
        // --------------------------------------------------
        var numItems = this.getSize();
        for (var i = 0; i < numItems; i++)
        {
            if (this.items[i].type === olexp.item.Type.GROUP)
            {
                var layerChild = this.managers[this.items[i].id].removeFromMap(item);
                if (layerChild !== null) return layerChild;
            }
        }
        
        return null;

    };

    /**
     * Set layers that are being managed
     * @function setLayers
     * @memberOf NodeManager.prototype
     * @param {external:ol.Collection} layers New layer collection to monitor.
     * @private
     */
    NodeManager.prototype.setLayers = function(layers)
    {

        // Remove old layers
        this.layers.un('change:length', this.onLayerChanged, this);
        while (this.items.length > 0)
        {
            this.onItemRemoved(this.items[this.items.length-1]);
        }

        // Add new layers
        this.layers = layers;
        this.layers.on('change:length', this.onLayerChanged, this);
        for (var j = 0; j < this.layers.getLength(); j++)
        {
            this.addLayer(this.layers.item(j));
        }

    };

    /**
     * Get items as list
     * @memberOf NodeManager.prototype
     * @private
     * @returns {array} List of items
     */
    NodeManager.prototype.toList = function()
    {

        var items = [];
        var numItems = this.getSize();
        for (var i = 0; i < numItems; i++)
        {
            items.push(this.items[i]);
        }
        return items;

    };

    /**
     * Node manager that synchronizes adding and removing items
     * @function
     * @memberOf olexp.manager
     * @param {string} id Node id
     * @param {external:ol.Map} map Managed map
     * @param {external:jQuery.fn.w2sidebar} outline Managed outline sidebar
     * @param {external:jQuery.fn.w2grid} details Details grid
     * @public
     */
    olexp.manager.NodeManager = function(id, map, outline, details)
    {
        var manager = new NodeManager(id, map, outline, details);
        return {
            getById        : manager.getById.bind(manager),
            getByLayer     : manager.getByLayer.bind(manager),
            moveDown       : manager.moveDown.bind(manager),
            moveUp         : manager.moveUp.bind(manager),
            off            : manager.off.bind(manager),
            on             : manager.on.bind(manager),
            removeFromMap  : manager.removeFromMap.bind(manager),
            setLayers      : manager.setLayers.bind(manager)
        };
    };

    return olexp;

}(olexp || {}));
