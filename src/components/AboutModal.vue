<template>
  <div class="about__container">
    <div class="about__modal">
      <div ref="about" class="about" v-html="editStore.getters.about()"></div>
      <div v-show="data.editAbout.edit" class="buttons">
        <div class="remove__paragraph">
          <div class="btn" v-on:click="handleRemoveParagraph">
            <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24.81 4.61"
            >
              <rect
                  class="d"
                  x="10.1"
                  y="-10.1"
                  width="4.61"
                  height="24.81"
                  rx="2.3"
                  ry="2.3"
                  transform="translate(14.71 -10.1) rotate(90)"
              />
            </svg>
          </div>
        </div>
        <div class="add__paragraph">
          <div class="btn" v-on:click="handleAddParagraph">
            <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24.81 24.81"
            >
              <path
                  class="d"
                  d="M23.31,10.1H14.71V1.5c0-.83-.67-1.5-1.5-1.5h-1.6c-.83,0-1.5,.67-1.5,1.5V10.1H1.5c-.83,0-1.5,.67-1.5,1.5v1.6c0,.83,.67,1.5,1.5,1.5H10.1v8.6c0,.83,.67,1.5,1.5,1.5h1.6c.83,0,1.5-.67,1.5-1.5V14.71h8.6c.83,0,1.5-.67,1.5-1.5v-1.6c0-.83-.67-1.5-1.5-1.5Z"
              />
            </svg>
          </div>
        </div>
      </div>
      <div v-show="data.editAbout.edit" class="about__submit">
        <button class="btn" v-on:click.prevent="handleSubmit">Submit</button>
      </div>
    </div>
  </div>
</template>
<script>
import EventBus from "@/Common/EventBus.js";
import editStore from '@/store/editStore.js'
import {ref, watchEffect} from "@vue/runtime-core";
import markdownit from "markdown-it";

export default {
  props: ["data"],
  setup(props) {
    const md = markdownit({
      html: true,
      breaks: true,
      linkify: true,
    }).disable("code");
    editStore.actions.fetchData();
    const about = ref("")
    const counter = ref(0)
    const selectParagraph = ref(null)

    const resetPTag = (tags) => {
      for (const pTag in tags) {
        if (tags[pTag].tagName === "P") {
          tags[pTag].classList.remove("edit")
          tags[pTag].contentEditable = "false"
          tags[pTag].removeAttribute("data-number")
          tags[pTag].removeEventListener("click", listener)
        }
      }
    }

    const convertToHTML = (tags)=>{
      for (const pTag in tags) {
        if (tags[pTag].tagName === "P") {
          const render = md.render(tags[pTag].textContent)
          tags[pTag].innerHTML = render.replace(/<\/?p>/g, '')
        }
      }
    }

    const getMarkdown = (tags)=>{
      let res = ""
      for (const pTag in tags) {
        if (tags[pTag].tagName === "P") {
          res += `${tags[pTag].textContent}\n`
        }
      }
      return res
    }

    const setPTag = (tags) => {
      const md = editStore.state['about_md'].split(/\n/).filter(element => element)
      for (const pTag in tags) {
        if (tags[pTag].tagName === "P") {
          tags[pTag].setAttribute("data-number", counter.value);
          tags[pTag].classList.add("edit")
          tags[pTag].contentEditable = "true"
          tags[pTag].addEventListener("click", listener)
          tags[pTag].spellcheck = true
          tags[pTag].textContent = md[counter.value]
          counter.value++
        }
      }
    }

    const listener = (e) => {
      selectParagraph.value = e.target.getAttribute("data-number")
    }

    const handleAddParagraph = () => {
      const p = document.createElement("p")
      p.classList.add("edit")
      p.contentEditable = "true"
      p.setAttribute("data-number", counter.value);
      about.value.appendChild(p)
      counter.value++
    }

    const handleRemoveParagraph = () => {
      if (confirm("Are you sure you want to remove this paragraph? This action cannot be undone.")) {
        if (selectParagraph.value === 0) {
          return alert("You kindly cannot remove first paragraph")
        } else if (selectParagraph.value === null) {
          return about.value.removeChild(about.value.lastElementChild)
        } else {
          for (const pTag in about.value.children) {
            if (about.value.children[pTag].getAttribute("data-number") === selectParagraph.value) {
              about.value.children[pTag].remove()
              break;
            }
          }
        }
      }
    }

    const handleSubmit = () => {
      if (confirm("Are you sure you want to submit these changes?")) {
        const md = getMarkdown(about.value.children)
        convertToHTML(about.value.children)
        props.data.editAbout.edit = false
        resetPTag(about.value.children)
        const data = {
          role: JSON.parse(localStorage?.user).role === 1 ? "admin" : "reader",
          content: about.value.innerHTML,
          md
        }
        editStore.actions?.updateData(data).catch((err) => {
          if (err.response && err.response.status === 403) {
            EventBus.dispatch("logout");
          }
        })
      }
    }

    watchEffect(() => {
      if (props.data.editAbout.edit) {
        setPTag(about.value.children)
      } else {
        resetPTag(about.value.children)
      }
    })

    return {
      about,
      editStore,
      handleSubmit,
      handleAddParagraph,
      handleRemoveParagraph
    }
  }
}
</script>


<style lang="scss">
.about__container {
  z-index: 20;
  color: var(--black-color);
  width: 100%;
  background-color: var(--primary-color);
  margin: 0 auto;
  padding: 1rem 1rem 3rem 1rem;
  font-size: var(--font-size);
  position: absolute;
  inset: 0;
  overflow-y: scroll;

  .about__modal {
    margin: 0 auto;
    width: 40rem;
    height: auto;
    display: flex;
    gap: 2em;
    position: relative;
    @media screen and (max-width: 60em) {
      flex-direction: column-reverse;
      width: 80vw;
    }

    .about {
      p {
        &.edit {
          background: var(--5-white-color);
          margin-bottom: 0.5rem;
          padding: 0.5rem;
          border-radius: 0.5rem;
          transition: all 0.3s var(--easing);

          &:hover,
          &:focus {
            filter: brightness(0.9);
          }
        }
      }

      p + p {
        text-indent: 2em;
        padding-top: 1rem;
      }
    }

    .buttons {
      position: absolute;
      bottom: 0;
      left: 100%;
      padding: 0.5rem;
      display: flex;
      flex-direction: column;
      gap: 0.25rem;

      .add__paragraph,
      .remove__paragraph {
        .btn {
          font-weight: bold;
          cursor: pointer;
          background-color: var(--white-color);
          color: var(--primary-color);
          border-radius: 0.25rem;
          width: 2rem;
          height: 2rem;
          font-size: 1.5rem;
          transition: all 0.3s var(--easing);
          display: grid;
          place-content: center;

          &:hover,
          &:focus {
            filter: brightness(0.9) drop-shadow(
                    0 0 0.5rem var(
                            --primary-color
                    )
            );
          }

          svg {
            width: 1rem;
            fill: var(--primary-color);
          }
        }
      }
    }

    .about__submit {
      position: absolute;
      top: 100%;

      button {
        cursor: pointer;
        border: none;
        background-color: var(--black-color);
        color: var(--primary-color);
        transition: all 0.3s var(--easing);

        &:hover,
        &:focus {
          filter: invert(1) drop-shadow(
                  0 0 0.5rem var(
                          --primary-color
                  )
          );
        }
      }
    }
  }
}
</style>