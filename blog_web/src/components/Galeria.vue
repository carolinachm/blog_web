<template>
  <div>
    <v-toolbar flat color="white">
      <v-toolbar-title>Galeria</v-toolbar-title>
      <v-divider
        class="mx-2"
        inset
        vertical
      ></v-divider>
      <v-spacer></v-spacer>
      <v-dialog v-model="dialog" max-width="500px">
        <v-btn slot="activator" color="primary" dark class="mb-2">Nova Foto</v-btn>
        <v-card>
          <v-card-title>
            <span class="headline">{{ formTitle }}</span>
          </v-card-title>

          <v-card-text>
            <v-container grid-list-md>
              <v-layout wrap>
                <v-flex xs12 sm12 >
                  <v-text-field v-model="galeria.descricao" label="Descrição"></v-text-field>
                </v-flex>
               	<v-flex xs12 class="text-xs-center text-sm-center text-md-center text-lg-center">
					<img :src="imageUrl" height="150" v-if="imageUrl"/>
					<v-text-field label="Select Image" @click='pickFile' v-model='imageName' prepend-icon='attach_file'></v-text-field>
					<input
						type="file"
						style="display: none"
						ref="image"
						accept="image/*"
						@change="onFilePicked"
					>
				</v-flex>
				<v-dialog v-model="dialog" max-width="290">
					<v-card>
						<v-card-title class="headline">Hello World!</v-card-title>
						<v-card-text>Image Upload Script in VUE JS
							<hr>Yubaraj Shrestha
							<br>http://yubarajshrestha.com.np/</v-card-text>
						<v-card-actions>
							<v-spacer></v-spacer>
							<v-btn color="green darken-1" flat="flat" @click.native="dialog = false">Close</v-btn>
						</v-card-actions>
					</v-card>
				</v-dialog>
				
              </v-layout>
            </v-container>
          </v-card-text>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" flat @click.native="close">Cancel</v-btn>
            <v-btn color="blue darken-1" flat @click.native="save">Save</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-toolbar>
    <v-data-table
      :headers="headers"
      :items="galerias"
      hide-actions
      class="elevation-1"
    >
      <template slot="items" slot-scope="galeria">
        <td>{{ galeria.item.descricao }}</td>
        <td class="text-xs-right">{{ galeria.item.foto }}</td>
        
        <td class="justify-center layout px-0">
          <v-icon
            small
            class="mr-2"
            @click="editItem(galeria.item)"
          >
            edit
          </v-icon>
          <v-icon
            small
            @click="deleteItem(galeria.item)"
          >
            delete
          </v-icon>
        </td>
      </template>
      <template slot="no-data">
        <v-btn color="primary" @click="initialize">Reset</v-btn>
      </template>
    </v-data-table>
  </div>
</template>
<script>
  export default {
    data: () => ({
      dialog: false,
      imageName: '',
		imageUrl: '',
		imageFile: '',
      headers: [
        {
          text: 'Id',
          align: 'left',
          sortable: false,
          value: 'name'
        },
        { text: 'Descrição', value: 'descrição' },
        { text: 'foto', value: 'fotot' },
       
      ],
      galerias: [],
      editedIndex: -1,
      galeria: {
        descricao: '',
        foto: ''
       
      },
      defaultItem: {
        descricao: '',
        foto: ''
      }
    }),

    computed: {
      formTitle () {
        return this.editedIndex === -1 ? 'Nova Foto' : 'Editar foto'
      }
    },

    watch: {
      dialog (val) {
        val || this.close()
      }
    },

    created () {
      this.initialize()
    },

    methods: {
      initialize () {
        this.desserts = []
      },
       pickFile () {
            this.$refs.image.click ()
        },

      editItem (item) {
        this.editedIndex = this.desserts.indexOf(item)
        this.galeria = Object.assign({}, item)
        this.dialog = true
      },

      deleteItem (item) {
        const index = this.desserts.indexOf(item)
        confirm('Are you sure you want to delete this item?') && this.desserts.splice(index, 1)
      },

      close () {
        this.dialog = false
        setTimeout(() => {
          this.galeria = Object.assign({}, this.defaultItem)
          this.editedIndex = -1
        }, 300)
      },

      save () {
        if (this.editedIndex > -1) {
          Object.assign(this.desserts[this.editedIndex], this.galeria)
        } else {
          this.desserts.push(this.galeria)
        }
        this.close()
      }
    },
    onFilePicked (e) {
			const files = e.target.files
			if(files[0] !== undefined) {
				this.imageName = files[0].name
				if(this.imageName.lastIndexOf('.') <= 0) {
					return
				}
				const fr = new FileReader ()
				fr.readAsDataURL(files[0])
				fr.addEventListener('load', () => {
					this.imageUrl = fr.result
					this.imageFile = files[0] // this is an image file that can be sent to server...
				})
			} else {
				this.imageName = ''
				this.imageFile = ''
				this.imageUrl = ''
			}
		}
    }
  
</script>