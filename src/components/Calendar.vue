<template>
  <v-row class="fill-height">
    <v-col>
      <v-sheet height="64">
        <v-toolbar flat>
          <v-btn class="mr-4" color="primary" dark @click="dialog = true">
            Добавить
          </v-btn>
          <v-btn outlined class="mr-4" color="grey darken-2" @click="setToday">
            Сегодня
          </v-btn>
          <v-btn fab text small color="grey darken-2" @click="prev">
            <v-icon small>
              mdi-chevron-left
            </v-icon>
          </v-btn>
          <v-btn
            fab
            text
            small
            color="grey darken-2"
            @click="next"
            class="mr-4"
          >
            <v-icon small>
              mdi-chevron-right
            </v-icon>
          </v-btn>
          <v-toolbar-title v-if="$refs.calendar">
            {{ $refs.calendar.title }}
          </v-toolbar-title>
          <v-spacer></v-spacer>
          <v-menu bottom right>
            <template v-slot:activator="{ on, attrs }">
              <v-btn outlined color="grey darken-2" v-bind="attrs" v-on="on">
                <span>{{ typeToLabel[type] }}</span>
                <v-icon right>
                  mdi-menu-down
                </v-icon>
              </v-btn>
            </template>
            <v-list>
              <v-list-item @click="type = 'day'">
                <v-list-item-title>День</v-list-item-title>
              </v-list-item>
              <v-list-item @click="type = 'week'">
                <v-list-item-title>Неделя</v-list-item-title>
              </v-list-item>
              <v-list-item @click="type = 'month'">
                <v-list-item-title>Месяц</v-list-item-title>
              </v-list-item>
              <v-list-item @click="type = '4day'">
                <v-list-item-title>4 Дня</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </v-toolbar>
      </v-sheet>

      <!--Диалоговое окно -->
      <v-dialog v-model="dialog" max-width="500">
        <v-card>
          <v-container> 
             
              <h2>Новое событие</h2>
              <v-form @submit.prevent="addEvent" class="pa-4">
                 <v-text-field v-model="name" type="text" label="Имя события"></v-text-field>   
                  <v-text-field v-model="details" type="text" label="Дополнительная информация"></v-text-field>
                   <v-text-field v-model="start" type="date" label="Начало события"></v-text-field>
                    <v-text-field v-model="end" type="date" label="Окончание события"></v-text-field>   
                    <v-text-field v-model="color" type="color" label="Выберите цвет"></v-text-field> 
                    <v-btn type="submit"
                     color="primary"
                     class="mr-4"
                     @click.stop="dialog = false">Создать</v-btn>       
              </v-form>
             
          </v-container>
        </v-card>
      </v-dialog>

      <!--Диалоговое окно -->
      <v-sheet height="600">
        <v-calendar
          ref="calendar"
          v-model="focus"
          color="primary"
          :events="events"
          :event-color="getEventColor"
          :type="type"
          @click:event="showEvent"
          @click:more="viewDay"
          @click:date="viewDay"
          @change="updateRange"
        ></v-calendar>
        <v-menu
          v-model="selectedOpen"
          :close-on-content-click="false"
          :activator="selectedElement"
          offset-x
        >
          <v-card color="grey lighten-4" min-width="350px" flat>
            <v-toolbar :color="selectedEvent.color" dark>
              <v-btn icon @click="deleteEvent(selectedEvent.id)">
                <v-icon>mdi-delete</v-icon>
              </v-btn>
              <v-toolbar-title v-html="selectedEvent.name"></v-toolbar-title>
              <v-spacer></v-spacer>
            </v-toolbar>
            <v-card-text>
              <form v-if="currentlyEditing !== selectedEvent.id">
                {{ selectedEvent.details }}
              </form>
              <form v-else>
                <textarea-autosize
                  v-model="selectedEvent.details"
                  type="text"
                  style="width: 100%"
                  :min-height="100"
                  placeholder="Добавьте запись"
                >
                </textarea-autosize>
              </form>
            </v-card-text>
            <v-card-actions>
              <v-btn text color="secondary" @click="selectedOpen = false">
                Закрыть
              </v-btn>
              <v-btn
                text
                v-if="currentlyEditing !== selectedEvent.id"
                @click.prevent="editEvent(selectedEvent)"
              >
                Редактировать
              </v-btn>
              <v-btn text v-else @click.prevent="updateEvent(selectedEvent)">
                Сохранить
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-menu>
      </v-sheet>
    </v-col>
  </v-row>
</template>

<script>
import { db } from "@/main";

export default {
  data: () => ({
    today: new Date().toISOString().substr(0, 10),
    focus: new Date().toISOString().substr(0, 10),
    type: "month",
    typeToLabel: {
      month: "Месяц",
      week: "Неделя",
      day: "День",
      "4day": "4 Дня",
    },
    name: null,
    details: null,
    start: null,
    end: null,
    color: "#1976D2",
    currentlyEditing: null,
    selectedEvent: {},
    selectedElement: null,
    selectedOpen: false,
    events: [],
    dialog: false,
  }),
  mounted() {
    this.getEvents();
  },
  methods: {
    async getEvents() {
      let snapshot = await db.collection("calEvent").get();
      let events = [];
      snapshot.forEach((doc) => {
        let appData = doc.data();
        appData.id = doc.id;
        events.push(appData);
      });
      this.events = events;
    },

    viewDay({ date }) {
      this.focus = date;
      this.type = "day";
    },
    getEventColor(event) {
      return event.color;
    },
    setToday() {
      this.focus = "";
    },
    prev() {
      this.$refs.calendar.prev();
    },
    next() {
      this.$refs.calendar.next();
    },
    showEvent({ nativeEvent, event }) {
      const open = () => {
        this.selectedEvent = event;
        this.selectedElement = nativeEvent.target;
        setTimeout(() => {
          this.selectedOpen = true;
        }, 10);
      };

      if (this.selectedOpen) {
        this.selectedOpen = false;
        setTimeout(open, 10);
      } else {
        open();
      }

      nativeEvent.stopPropagation();
    },

    updateRange() {},

    editEvent(ev) {
      this.currentlyEditing = ev.id;
    },

    async updateEvent(ev) {
      await db
        .collection("calEvent")
        .doc(this.currentlyEditing)
        .update({
          details: ev.details,
        });
      this.selectedOpen = false;
      this.currentlyEditing = null;
    },

    async deleteEvent(ev) {
      await db
        .collection("calEvent")
        .doc(ev)
        .delete();

      this.selectedOpen = false;
      this.getEvents();
    },

    async addEvent(){
        if(this.name && this.start && this.end){
            await db.collection('calEvent').add({
                name: this.name,
                details: this.details,
                start: this.start,
                end: this.end,
                color: this.color
            })
            this.getEvents();
            this.name = ''
            this.details = ''
            this.start = ''
            this.end = ''
            this.color = ''

        }else{
            alert('Error')
        }
    }
  },
};
</script>
