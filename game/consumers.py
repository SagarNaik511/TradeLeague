import json
from channels.generic.websocket import AsyncWebsocketConsumer

class RoomConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.room = self.scope['url_route']['kwargs']['code']
        self.group = f"room_{self.room}"

        await self.channel_layer.group_add(self.group,self.channel_name)
        await self.accept()

    async def receive(self,text_data):
        await self.channel_layer.group_send(
            self.group,
            {"type":"broadcast","data":text_data}
        )

    async def broadcast(self,event):
        await self.send(text_data=event["data"])

    async def disconnect(self,close_code):
        await self.channel_layer.group_discard(self.group,self.channel_name)
