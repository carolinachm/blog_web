<template>
  <div>
    <v-toolbar flat color="white">
      <v-toolbar-title>Blog</v-toolbar-title>
      <v-divider
        class="mx-2"
        inset
        vertical
      ></v-divider>
      <v-spacer></v-spacer>
      <v-dialog v-model="dialog" max-width="500px">
        <v-btn slot="activator" color="primary" dark class="mb-2">Nova Blog</v-btn>
        <v-card>
          <v-card-title>
            <span class="headline">{{ formTitle }}</span>
          </v-card-title>

          <v-card-text>
            <v-container grid-list-md>
              <v-layout wrap>
                <v-flex xs12 sm12 >
                  <v-text-field v-model="blog.nome" label="Nome"></v-text-field>
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
			
				
              </v-layout>
            </v-container>
          </v-card-text>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" flat @click.native="close">Cancelar</v-btn>
            <v-btn color="blue darken-1" flat @click.native="save">Salvar</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-toolbar>
     <v-text-field
        v-model="search"
        append-icon="search"
        label="Busca"
        single-line
        hide-details
      ></v-text-field>
    
    <v-data-table
      :headers="headers"
      :items="blogs"
      :search="search"
      :pagination.sync="pagination"
      hide-actions
      class="elevation-1"
      
      
    >
      <template slot="items" slot-scope="blog">
        <td>{{ blog.item.id }}</td>
        <td class="text-xs-right">{{ blog.item.nome }}</td>
        <td class="text-xs-right">{{ blog.item.foto }}</td>
        <td class="text-xs-right">{{ blog.item.autor }}</td>
        <td class="text-xs-right">{{ blog.item.post }}</td>
       
        
        <td class="justify-center layout px-0">
          <v-icon
            small
            class="mr-2"
            @click="editItem(blog.item)"
          >
            edit
          </v-icon>
          <v-icon
            small
            @click="deleteItem(blog.item)"
          >
            delete
          </v-icon>
        </td>
      </template>
       
      <template slot="no-data">
        <v-btn color="primary" @click="initialize">Iniciar</v-btn>
      </template>
      
    </v-data-table>
    <div class="text-xs-center pt-2">
      <v-pagination v-model="pagination.page" :length="pages"></v-pagination>
    </div>
  </div>
</template>
<script>
import { axios } from "axios";

export default {
  data: () => ({
    search: "",
    pagination: {},
    dialog: false,
    imageName: "",
    imageUrl: "",
    imageFile: "",
    headers: [
      {
        text: "id",
        align: "left",
        sortable: false,
        value: "name"
      },
      { text: "Nome", value: "Nome" },
      { text: "Foto", value: "foto" },
      { text: "Autor", value: "autor" },
      { text: "Post", value: "post" },
      { text: "Ações", value: "ações" }
    ],
    blogs: [],
    posts: [],
    editedIndex: -1,
    blog: {
      nome: "",
      foto: "",
      autor: "",
      posts: []
    },
    defaultItem: {
      nome: "",
      foto: "",
      autor: "",
      posts: []
    }
  }),

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "Nova Blog" : "Editar Blog";
    }
  },

  watch: {
    dialog(val) {
      val || this.close();
    }
  },

  created() {
    this.initialize();
  },

  methods: {
     pickFile () {
            this.$refs.image.click ()
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
    },

    async findAll() {
      try {
        let resp = await axios.get("http://localhost:3000/blogs");
        this.blogs = resp.data;
      } catch (error) {
        alert("Falha na requisicao");
        console.log("Erro ao carregar o blog" + error);
      }
    },
    initialize() {
      this.findAll();
    },

    async save() {
      try {
        if (this.blog._id) {
          const resp = await axios.put(
            "http://localhost:3000/blogs",
            this.blog
          );
        } else {
          const resp = await axios.post(
            "http://localhost:3000/blogs",
            this.blog
          );
        }
        this.findAll();
        this.clean();
        this.close();
      } catch (error) {
        alert("Falha na requisicao");
        console.log("Erro ao carregar o blog" + error);
      }
    },

    editItem(item) {
      this.editedIndex = this.blogs.indexOf(item);
      this.blog = Object.assign({}, item);
      this.dialog = true;
    },
    deleteItem(item) {
      const index = this.clientes.indexOf(item);
      confirm("Tem certeza de que deseja excluir este blog?") &&
        this.blogs.splice(index, 1);
      axios
        .delete("http://localhost:3000/blogs" + this.blog._id)
        .then(response => {
          console.log(response);
        });
    },

    clean() {
      this.blog = blog;
    },

    close() {
      this.dialog = false;
      setTimeout(() => {
        this.blog = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      }, 300);
    }
  
};
</script>