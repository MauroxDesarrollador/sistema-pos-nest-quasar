import { Controller, Get, Query, Put, Body, Param, Post } from '@nestjs/common';

@Controller('freescout')
export class FreescoutController {
  private baseUrl: string;
  private apiKey: string;

  constructor() {
    this.baseUrl = 'http://164.92.109.31:4021/api/';
    this.apiKey = 'b8819bf3a3217dc35c4fc096d5064e8f';
  }

  @Get('conversations')
  async getConversations(@Query() query: Record<string, any>) {
    const url = new URL(this.baseUrl+"conversations");
    query.api_key = this.apiKey; // Añadir la clave API a los parámetros

    Object.keys(query).forEach(key => url.searchParams.append(key, query[key]));

    try {
      const response = await fetch(url.toString(), {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      return response.json();
    } catch (error) {
      throw new Error(`Error fetching conversations: ${error.message}`);
    }
  }

  @Get('conversations/:id')
  async showConversation(@Param('id') id: string) {
    const url = new URL(`${this.baseUrl}conversations/${id}`);
    
    try {
      const response = await fetch(url.toString(), {
        method: 'GET',
        headers: {
          'X-FreeScout-API-Key': this.apiKey
        },
      });

      if (!response.ok) {
        console.log(response);
        throw new Error(`Error: ${response.statusText}`);
      }

      return response.json();
    } catch (error) {
      throw new Error(`Error fetching conversation: ${error.message}`);
    }
  }
  @Post('conversations')
  async createConversations(@Body() body: Record<string, any>) {
    const url = new URL(`${this.baseUrl}conversations`);
    
    try {
      const response = await fetch(url.toString(), {
        method: 'POST',
        headers: {
          'X-FreeScout-API-Key': this.apiKey,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      return response.json();
    } catch (error) {
      throw new Error(`Error creating conversation: ${error.message}`);
    }
  }
  @Put('conversations/:id')
  async updateConversation(@Param('id') id: string, @Body() body: Record<string, any>) {
    const url = new URL(`${this.baseUrl}/conversations/${id}`);

    const headers = {
      'X-FreeScout-API-Key': this.apiKey,
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };

    try {
      const response = await fetch(url.toString(), {
        method: 'PUT',
        headers: headers,
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      return response.json();
    } catch (error) {
      throw new Error(`Error updating conversation: ${error.message}`);
    }
  }

  @Get('mailboxes')
  async getMailbox(@Query() query: Record<string, any>) {
    const url = new URL(this.baseUrl+"mailboxes");
    query.api_key = this.apiKey; // Añadir la clave API a los parámetros

    Object.keys(query).forEach(key => url.searchParams.append(key, query[key]));

    try {
      const response = await fetch(url.toString(), {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      return response.json();
    } catch (error) {
      throw new Error(`Error fetching mailbox: ${error.message}`);
    }
  }

  @Get('mailboxes/:id')
  async showMailbox(@Param('id') id: string) {
    const url = new URL(`${this.baseUrl}/mailboxes/${id}`);
    
    try {
      const response = await fetch(url.toString(), {
        method: 'GET',
        headers: {
          'X-FreeScout-API-Key': this.apiKey,
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      return response.json();
    } catch (error) {
      throw new Error(`Error fetching mailbox: ${error.message}`);
    }
  }
} 
